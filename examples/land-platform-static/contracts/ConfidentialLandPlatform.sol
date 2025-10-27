// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32, euint64, ebool, euint16 } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract ConfidentialLandPlatform is SepoliaConfig {

    address public cityPlanningAuthority;
    uint256 public nextZoneId;
    uint256 public nextProjectId;

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

    mapping(uint256 => ConfidentialZone) public zones;
    mapping(uint256 => PlanningProject) public projects;
    mapping(uint256 => DevelopmentMetrics) public metrics;
    mapping(address => bool) public authorizedPlanners;
    mapping(address => bool) public landOwners;

    event ZoneRegistered(uint256 indexed zoneId, address indexed owner, string description);
    event ProjectSubmitted(uint256 indexed projectId, address indexed proposer, string projectName, uint256 targetZoneId);
    event ProjectApproved(uint256 indexed projectId, address indexed approver);
    event MetricsUpdated(uint256 indexed zoneId, address indexed updater);
    event PlannerAuthorized(address indexed planner, address indexed authority);
    event DevelopmentAnalysisRequested(uint256 indexed zoneId);

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

    constructor() {
        cityPlanningAuthority = msg.sender;
        nextZoneId = 1;
        nextProjectId = 1;
    }

    // Register a new confidential land zone
    function registerLandZone(
        uint32 _area,
        uint32 _population,
        uint32 _value,
        uint16 _zoningType,
        string memory _publicDescription
    ) external {
        require(_zoningType >= 1 && _zoningType <= 4, "Invalid zoning type");

        // Encrypt sensitive land data
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

    // Submit confidential planning project proposal
    function submitPlanningProject(
        uint32 _budget,
        uint16 _impactScore,
        uint32 _timeline,
        string memory _projectName,
        uint256 _targetZoneId
    ) external onlyLandOwner {
        require(zones[_targetZoneId].isRegistered, "Zone not registered");
        require(_impactScore <= 100, "Impact score must be 0-100");

        // Encrypt sensitive project data
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

    // Update confidential development metrics for a zone
    function updateDevelopmentMetrics(
        uint256 _zoneId,
        uint32 _densityIndex,
        uint32 _trafficVolume,
        uint16 _greenSpaceRatio,
        uint16 _infrastructureScore
    ) external onlyAuthorizedPlanner {
        require(zones[_zoneId].isRegistered, "Zone not registered");
        require(_greenSpaceRatio <= 100, "Green space ratio must be 0-100");
        require(_infrastructureScore <= 100, "Infrastructure score must be 0-100");

        // Encrypt development metrics
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

    // Approve project with confidential evaluation
    function approveProject(uint256 _projectId) external onlyAuthority {
        require(projects[_projectId].isActive, "Project not active");

        projects[_projectId].isApproved = true;

        emit ProjectApproved(_projectId, msg.sender);
    }

    // Compare zones confidentially and return encrypted result
    function compareZoneValues(uint256 _zoneId1, uint256 _zoneId2) external returns (bytes32) {
        require(zones[_zoneId1].isRegistered && zones[_zoneId2].isRegistered, "Zones not registered");

        // Perform encrypted comparison
        ebool isZone1Higher = FHE.gt(zones[_zoneId1].encryptedValue, zones[_zoneId2].encryptedValue);

        return FHE.toBytes32(isZone1Higher);
    }

    // Calculate confidential development potential
    function calculateDevelopmentPotential(uint256 _zoneId) external returns (bytes32) {
        require(zones[_zoneId].isRegistered, "Zone not registered");
        require(metrics[_zoneId].metricsSet, "Metrics not set");

        // Calculate encrypted development potential based on multiple factors
        euint32 potential = FHE.add(
            FHE.mul(zones[_zoneId].encryptedArea, FHE.asEuint32(10)),
            FHE.mul(FHE.asEuint32(metrics[_zoneId].encryptedGreenSpaceRatio), FHE.asEuint32(50))
        );

        return FHE.toBytes32(potential);
    }

    // Request confidential analysis for urban planning
    function requestUrbanAnalysis(uint256 _zoneId) external {
        require(zones[_zoneId].isRegistered, "Zone not registered");
        require(authorizedPlanners[msg.sender] || msg.sender == zones[_zoneId].owner, "Not authorized");

        // Trigger analysis process
        emit DevelopmentAnalysisRequested(_zoneId);

        // In a complete implementation, this would trigger off-chain analysis
        // using the encrypted data through FHE computation
    }

    // Authorize urban planner
    function authorizePlanner(address _planner) external onlyAuthority {
        authorizedPlanners[_planner] = true;
        emit PlannerAuthorized(_planner, msg.sender);
    }

    // Revoke planner authorization
    function revokePlannerAuthorization(address _planner) external onlyAuthority {
        authorizedPlanners[_planner] = false;
    }

    // Get zone public information
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

    // Get project public information
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

    // Check if address is authorized planner
    function isAuthorizedPlanner(address _address) external view returns (bool) {
        return authorizedPlanners[_address];
    }

    // Check if address is land owner
    function isLandOwner(address _address) external view returns (bool) {
        return landOwners[_address];
    }

    // Get total number of zones
    function getTotalZones() external view returns (uint256) {
        return nextZoneId - 1;
    }

    // Get total number of projects
    function getTotalProjects() external view returns (uint256) {
        return nextProjectId - 1;
    }
}