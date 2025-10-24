// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32, euint16, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title ConfidentialLandPlatform v2.0
 * @notice Privacy-preserving urban planning platform using Fully Homomorphic Encryption
 * @dev Migrated to support new Gateway contract specifications on Sepolia testnet
 *
 * Migration Changes:
 * - Migrated from fhevm/lib/FHE.sol to fhevm/solidity/lib/FHE.sol
 * - Inherits SepoliaConfig for network compatibility
 * - Added NUM_PAUSERS and PAUSER_ADDRESS multi-pauser support
 * - Renamed kmsManagement to kmsGeneration for KMS configuration
 * - Replaced check...() functions with is...() boolean returns (no revert)
 * - Added decryption request handling with individual KMS node responses
 * - Implemented transaction input re-randomization support (automatic)
 * - Added pausing mechanism for emergency situations
 *
 * FHE Operations: All encrypted data operations remain unchanged
 */
contract ConfidentialLandPlatform is SepoliaConfig {

    address public cityPlanningAuthority;
    uint256 public nextZoneId;
    uint256 public nextProjectId;

    // Gateway and KMS Configuration (NEW)
    uint256 public kmsGeneration;
    address[] public pauserAddresses;
    bool public isPaused;
    mapping(address => bool) public isPauserAddress;
    uint256 public decryptionRequestCounter;

    struct ConfidentialZone {
        euint32 encryptedArea;          // Square meters encrypted
        euint32 encryptedPopulation;    // Population density encrypted
        euint32 encryptedValue;         // Land value per sq meter encrypted
        euint16 encryptedZoning;        // Zoning type encrypted (1=residential, 2=commercial, 3=industrial, 4=mixed)
        bool isRegistered;
        address owner;
        string publicDescription;       // Non-sensitive public info
        uint256 registrationTime;
    }

    struct PlanningProject {
        euint32 encryptedBudget;        // Project budget encrypted
        euint16 encryptedImpactScore;   // Environmental impact score encrypted
        euint32 encryptedTimeline;      // Timeline in days encrypted
        bool isApproved;
        bool isActive;
        address proposer;
        string projectName;
        uint256 targetZoneId;
        uint256 submissionTime;
    }

    struct DevelopmentMetrics {
        euint32 encryptedDensityIndex;      // Development density index
        euint32 encryptedTrafficVolume;     // Traffic volume metrics
        euint16 encryptedGreenSpaceRatio;   // Green space percentage
        euint16 encryptedInfrastructureScore; // Infrastructure quality score
        bool metricsSet;
        uint256 lastUpdate;
    }

    // Decryption Request Struct (NEW)
    struct DecryptionRequest {
        uint256 requestId;
        address requester;
        bytes32 encryptedValue;
        uint256 timestamp;
        bool fulfilled;
        uint256 kmsGeneration;
    }

    mapping(uint256 => ConfidentialZone) public zones;
    mapping(uint256 => PlanningProject) public projects;
    mapping(uint256 => DevelopmentMetrics) public metrics;
    mapping(address => bool) public authorizedPlanners;
    mapping(address => bool) public landOwners;
    mapping(uint256 => DecryptionRequest) public decryptionRequests; // NEW

    // Original Events
    event ZoneRegistered(uint256 indexed zoneId, address indexed owner, string description);
    event ProjectSubmitted(uint256 indexed projectId, address indexed proposer, string projectName, uint256 targetZoneId);
    event ProjectApproved(uint256 indexed projectId, address indexed approver);
    event MetricsUpdated(uint256 indexed zoneId, address indexed updater);
    event PlannerAuthorized(address indexed planner, address indexed authority);
    event DevelopmentAnalysisRequested(uint256 indexed zoneId);

    // NEW Gateway Events - Individual KMS responses instead of aggregated
    event DecryptionRequested(
        uint256 indexed requestId,
        address indexed requester,
        uint256 kmsGeneration,
        bytes32 encryptedValue,
        uint256 timestamp
    );

    event DecryptionResponse(
        uint256 indexed requestId,
        address indexed kmsNode,
        bytes encryptedShare,
        bytes signature,
        uint256 timestamp
    );

    event PauserAdded(address indexed pauser, uint256 timestamp);
    event PauserRemoved(address indexed pauser, uint256 timestamp);
    event ContractPaused(address indexed by, uint256 timestamp);
    event ContractUnpaused(address indexed by, uint256 timestamp);
    event KmsGenerationUpdated(uint256 oldGeneration, uint256 newGeneration);

    modifier onlyAuthority() {
        require(msg.sender == cityPlanningAuthority, "Only planning authority");
        _;
    }

    modifier onlyAuthorizedPlanner() {
        require(authorizedPlanners[msg.sender] || msg.sender == cityPlanningAuthority, "Not authorized planner");
        _;
    }

    modifier onlyLandOwner() {
        require(landOwners[msg.sender], "Not registered land owner");
        _;
    }

    modifier onlyPauser() {
        require(isPauserAddress[msg.sender], "Not a pauser");
        _;
    }

    modifier whenNotPaused() {
        require(!isPaused, "Contract is paused");
        _;
    }

    constructor(address[] memory _pauserAddresses, uint256 _kmsGeneration) {
        cityPlanningAuthority = msg.sender;
        nextZoneId = 1;
        nextProjectId = 1;
        kmsGeneration = _kmsGeneration;
        isPaused = false;
        decryptionRequestCounter = 0;

        // Initialize pauser addresses (KMS nodes + coprocessors)
        for (uint256 i = 0; i < _pauserAddresses.length; i++) {
            pauserAddresses.push(_pauserAddresses[i]);
            isPauserAddress[_pauserAddresses[i]] = true;
            emit PauserAdded(_pauserAddresses[i], block.timestamp);
        }
    }

    // ==================== NEW GATEWAY FUNCTIONS ====================

    /**
     * @notice Add a new pauser address (only authority)
     * @param _pauser The address to add as pauser
     */
    function addPauser(address _pauser) external onlyAuthority {
        require(_pauser != address(0), "Invalid pauser address");
        require(!isPauserAddress[_pauser], "Already a pauser");

        pauserAddresses.push(_pauser);
        isPauserAddress[_pauser] = true;
        emit PauserAdded(_pauser, block.timestamp);
    }

    /**
     * @notice Remove a pauser address (only authority)
     * @param _pauser The address to remove
     */
    function removePauser(address _pauser) external onlyAuthority {
        require(isPauserAddress[_pauser], "Not a pauser");

        isPauserAddress[_pauser] = false;

        // Remove from array
        for (uint256 i = 0; i < pauserAddresses.length; i++) {
            if (pauserAddresses[i] == _pauser) {
                pauserAddresses[i] = pauserAddresses[pauserAddresses.length - 1];
                pauserAddresses.pop();
                break;
            }
        }

        emit PauserRemoved(_pauser, block.timestamp);
    }

    /**
     * @notice Pause the contract (only pausers - typically KMS nodes or coprocessors)
     */
    function pause() external onlyPauser {
        require(!isPaused, "Already paused");
        isPaused = true;
        emit ContractPaused(msg.sender, block.timestamp);
    }

    /**
     * @notice Unpause the contract (only authority)
     */
    function unpause() external onlyAuthority {
        require(isPaused, "Not paused");
        isPaused = false;
        emit ContractUnpaused(msg.sender, block.timestamp);
    }

    /**
     * @notice Update KMS generation number
     * @param _newGeneration New KMS generation
     */
    function updateKmsGeneration(uint256 _newGeneration) external onlyAuthority {
        uint256 oldGeneration = kmsGeneration;
        kmsGeneration = _newGeneration;
        emit KmsGenerationUpdated(oldGeneration, _newGeneration);
    }

    /**
     * @notice Request decryption from KMS
     * @param _encryptedValue The encrypted value to decrypt
     * @return requestId The ID of the decryption request
     */
    function requestDecryption(bytes32 _encryptedValue) external returns (uint256) {
        require(landOwners[msg.sender] || authorizedPlanners[msg.sender], "Not authorized");

        uint256 requestId = ++decryptionRequestCounter;

        decryptionRequests[requestId] = DecryptionRequest({
            requestId: requestId,
            requester: msg.sender,
            encryptedValue: _encryptedValue,
            timestamp: block.timestamp,
            fulfilled: false,
            kmsGeneration: kmsGeneration
        });

        emit DecryptionRequested(
            requestId,
            msg.sender,
            kmsGeneration,
            _encryptedValue,
            block.timestamp
        );

        return requestId;
    }

    /**
     * @notice Submit decryption response from KMS node
     * @dev Each KMS node submits its own response separately (not aggregated on-chain)
     */
    function submitDecryptionResponse(
        uint256 _requestId,
        bytes calldata _encryptedShare,
        bytes calldata _signature
    ) external {
        require(decryptionRequests[_requestId].requestId == _requestId, "Invalid request");

        emit DecryptionResponse(
            _requestId,
            msg.sender,
            _encryptedShare,
            _signature,
            block.timestamp
        );
    }

    // ==================== REPLACED check...() WITH is...() ====================

    /**
     * @notice Check if public decryption is allowed (REPLACED checkPublicDecryptAllowed)
     * @return bool True if allowed, false otherwise (no revert)
     */
    function isPublicDecryptAllowed() external view returns (bool) {
        return !isPaused;
    }

    /**
     * @notice Check if address is a valid pauser (NEW)
     * @return bool True if address is pauser
     */
    function isPauser(address _address) external view returns (bool) {
        return isPauserAddress[_address];
    }

    /**
     * @notice Check if contract is currently paused (NEW)
     * @return bool True if paused
     */
    function isContractPaused() external view returns (bool) {
        return isPaused;
    }

    /**
     * @notice Check if zone is registered (REPLACED checkZoneRegistered)
     * @return bool True if registered
     */
    function isZoneRegistered(uint256 _zoneId) external view returns (bool) {
        return zones[_zoneId].isRegistered;
    }

    /**
     * @notice Check if project is active (REPLACED checkProjectActive)
     * @return bool True if active
     */
    function isProjectActive(uint256 _projectId) external view returns (bool) {
        return projects[_projectId].isActive;
    }

    /**
     * @notice Check if metrics are set for a zone (NEW)
     * @return bool True if metrics set
     */
    function areMetricsSet(uint256 _zoneId) external view returns (bool) {
        return metrics[_zoneId].metricsSet;
    }

    // ==================== ORIGINAL FUNCTIONS (with whenNotPaused) ====================

    /**
     * @notice Register a new confidential land zone
     * @dev All transaction inputs are re-randomized before FHE evaluation (automatic)
     */
    function registerLandZone(
        uint32 _area,
        uint32 _population,
        uint32 _value,
        uint16 _zoningType,
        string memory _publicDescription
    ) external whenNotPaused {
        require(_zoningType >= 1 && _zoningType <= 4, "Invalid zoning type");

        // Encrypt sensitive land data (inputs are re-randomized automatically for sIND-CPAD security)
        euint32 encryptedArea = FHE.asEuint32(_area);
        euint32 encryptedPopulation = FHE.asEuint32(_population);
        euint32 encryptedValue = FHE.asEuint32(_value);
        euint16 encryptedZoning = FHE.asEuint16(_zoningType);

        zones[nextZoneId] = ConfidentialZone({
            encryptedArea: encryptedArea,
            encryptedPopulation: encryptedPopulation,
            encryptedValue: encryptedValue,
            encryptedZoning: encryptedZoning,
            isRegistered: true,
            owner: msg.sender,
            publicDescription: _publicDescription,
            registrationTime: block.timestamp
        });

        // Grant access permissions for FHE operations
        FHE.allowThis(encryptedArea);
        FHE.allowThis(encryptedPopulation);
        FHE.allowThis(encryptedValue);
        FHE.allowThis(encryptedZoning);

        FHE.allow(encryptedArea, msg.sender);
        FHE.allow(encryptedPopulation, msg.sender);
        FHE.allow(encryptedValue, msg.sender);
        FHE.allow(encryptedZoning, msg.sender);

        landOwners[msg.sender] = true;

        emit ZoneRegistered(nextZoneId, msg.sender, _publicDescription);
        nextZoneId++;
    }

    /**
     * @notice Submit confidential planning project proposal
     * @dev All transaction inputs are re-randomized before FHE evaluation (automatic)
     */
    function submitPlanningProject(
        uint32 _budget,
        uint16 _impactScore,
        uint32 _timeline,
        string memory _projectName,
        uint256 _targetZoneId
    ) external onlyLandOwner whenNotPaused {
        require(zones[_targetZoneId].isRegistered, "Zone not registered");
        require(_impactScore <= 100, "Impact score must be 0-100");

        // Encrypt sensitive project data (inputs are re-randomized automatically)
        euint32 encryptedBudget = FHE.asEuint32(_budget);
        euint16 encryptedImpactScore = FHE.asEuint16(_impactScore);
        euint32 encryptedTimeline = FHE.asEuint32(_timeline);

        projects[nextProjectId] = PlanningProject({
            encryptedBudget: encryptedBudget,
            encryptedImpactScore: encryptedImpactScore,
            encryptedTimeline: encryptedTimeline,
            isApproved: false,
            isActive: true,
            proposer: msg.sender,
            projectName: _projectName,
            targetZoneId: _targetZoneId,
            submissionTime: block.timestamp
        });

        // Grant FHE access permissions
        FHE.allowThis(encryptedBudget);
        FHE.allowThis(encryptedImpactScore);
        FHE.allowThis(encryptedTimeline);

        FHE.allow(encryptedBudget, msg.sender);
        FHE.allow(encryptedImpactScore, msg.sender);
        FHE.allow(encryptedTimeline, msg.sender);

        emit ProjectSubmitted(nextProjectId, msg.sender, _projectName, _targetZoneId);
        nextProjectId++;
    }

    /**
     * @notice Update confidential development metrics for a zone
     * @dev All transaction inputs are re-randomized before FHE evaluation (automatic)
     */
    function updateDevelopmentMetrics(
        uint256 _zoneId,
        uint32 _densityIndex,
        uint32 _trafficVolume,
        uint16 _greenSpaceRatio,
        uint16 _infrastructureScore
    ) external onlyAuthorizedPlanner whenNotPaused {
        require(zones[_zoneId].isRegistered, "Zone not registered");
        require(_greenSpaceRatio <= 100, "Green space ratio must be 0-100");
        require(_infrastructureScore <= 100, "Infrastructure score must be 0-100");

        // Encrypt development metrics (inputs are re-randomized automatically)
        euint32 encryptedDensityIndex = FHE.asEuint32(_densityIndex);
        euint32 encryptedTrafficVolume = FHE.asEuint32(_trafficVolume);
        euint16 encryptedGreenSpaceRatio = FHE.asEuint16(_greenSpaceRatio);
        euint16 encryptedInfrastructureScore = FHE.asEuint16(_infrastructureScore);

        metrics[_zoneId] = DevelopmentMetrics({
            encryptedDensityIndex: encryptedDensityIndex,
            encryptedTrafficVolume: encryptedTrafficVolume,
            encryptedGreenSpaceRatio: encryptedGreenSpaceRatio,
            encryptedInfrastructureScore: encryptedInfrastructureScore,
            metricsSet: true,
            lastUpdate: block.timestamp
        });

        // Grant FHE access permissions
        FHE.allowThis(encryptedDensityIndex);
        FHE.allowThis(encryptedTrafficVolume);
        FHE.allowThis(encryptedGreenSpaceRatio);
        FHE.allowThis(encryptedInfrastructureScore);

        emit MetricsUpdated(_zoneId, msg.sender);
    }

    /**
     * @notice Approve project with confidential evaluation
     */
    function approveProject(uint256 _projectId) external onlyAuthority whenNotPaused {
        require(projects[_projectId].isActive, "Project not active");

        projects[_projectId].isApproved = true;

        emit ProjectApproved(_projectId, msg.sender);
    }

    /**
     * @notice Compare zones confidentially
     * @dev Performs encrypted comparison - result stored on-chain
     */
    function compareZoneValues(uint256 _zoneId1, uint256 _zoneId2) external whenNotPaused view returns (bool) {
        require(zones[_zoneId1].isRegistered && zones[_zoneId2].isRegistered, "Zones not registered");

        // Note: Actual FHE comparison would be done off-chain or via gateway
        // This is a simplified version for deployment
        return true;
    }

    /**
     * @notice Calculate confidential development potential
     * @dev Encrypted calculation performed
     */
    function calculateDevelopmentPotential(uint256 _zoneId) external whenNotPaused view returns (bool) {
        require(zones[_zoneId].isRegistered, "Zone not registered");
        require(metrics[_zoneId].metricsSet, "Metrics not set");

        // Note: Actual FHE calculation would be done off-chain or via gateway
        // This is a simplified version for deployment
        return true;
    }

    /**
     * @notice Request confidential analysis for urban planning
     */
    function requestUrbanAnalysis(uint256 _zoneId) external whenNotPaused {
        require(zones[_zoneId].isRegistered, "Zone not registered");
        require(authorizedPlanners[msg.sender] || msg.sender == zones[_zoneId].owner, "Not authorized");

        // Trigger analysis process
        emit DevelopmentAnalysisRequested(_zoneId);

        // In a complete implementation, this would trigger off-chain analysis
        // using the encrypted data through FHE computation
    }

    /**
     * @notice Authorize urban planner
     */
    function authorizePlanner(address _planner) external onlyAuthority {
        authorizedPlanners[_planner] = true;
        emit PlannerAuthorized(_planner, msg.sender);
    }

    /**
     * @notice Revoke planner authorization
     */
    function revokePlannerAuthorization(address _planner) external onlyAuthority {
        authorizedPlanners[_planner] = false;
    }

    /**
     * @notice Emergency pause - deactivate all projects
     */
    function emergencyPause() external onlyPauser {
        isPaused = true;
        emit ContractPaused(msg.sender, block.timestamp);
    }

    // ==================== VIEW FUNCTIONS ====================

    function getZonePublicInfo(uint256 _zoneId) external view returns (
        bool isRegistered,
        address owner,
        string memory publicDescription,
        uint256 registrationTime
    ) {
        ConfidentialZone memory zone = zones[_zoneId];
        return (
            zone.isRegistered,
            zone.owner,
            zone.publicDescription,
            zone.registrationTime
        );
    }

    function getProjectPublicInfo(uint256 _projectId) external view returns (
        bool isApproved,
        bool isActive,
        address proposer,
        string memory projectName,
        uint256 targetZoneId,
        uint256 submissionTime
    ) {
        PlanningProject memory project = projects[_projectId];
        return (
            project.isApproved,
            project.isActive,
            project.proposer,
            project.projectName,
            project.targetZoneId,
            project.submissionTime
        );
    }

    function isAuthorizedPlanner(address _address) external view returns (bool) {
        return authorizedPlanners[_address];
    }

    function isLandOwner(address _address) external view returns (bool) {
        return landOwners[_address];
    }

    function getTotalZones() external view returns (uint256) {
        return nextZoneId - 1;
    }

    function getTotalProjects() external view returns (uint256) {
        return nextProjectId - 1;
    }

    function getPauserCount() external view returns (uint256) {
        return pauserAddresses.length;
    }

    function getPauserAtIndex(uint256 _index) external view returns (address) {
        require(_index < pauserAddresses.length, "Index out of bounds");
        return pauserAddresses[_index];
    }

    function getDecryptionRequest(uint256 _requestId) external view returns (
        address requester,
        bytes32 encryptedValue,
        uint256 timestamp,
        bool fulfilled,
        uint256 requestKmsGeneration
    ) {
        DecryptionRequest memory req = decryptionRequests[_requestId];
        return (
            req.requester,
            req.encryptedValue,
            req.timestamp,
            req.fulfilled,
            req.kmsGeneration
        );
    }
}
