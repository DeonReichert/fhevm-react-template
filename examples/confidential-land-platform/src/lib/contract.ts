export const CONTRACT_ADDRESS = '0x46c69291e1337955aD157087b7badBdc08C20630';

export const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "zoneId",
        "type": "uint256"
      }
    ],
    "name": "DevelopmentAnalysisRequested",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "zoneId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "updater",
        "type": "address"
      }
    ],
    "name": "MetricsUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "planner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "authority",
        "type": "address"
      }
    ],
    "name": "PlannerAuthorized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "projectId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "approver",
        "type": "address"
      }
    ],
    "name": "ProjectApproved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "projectId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "proposer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "projectName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "targetZoneId",
        "type": "uint256"
      }
    ],
    "name": "ProjectSubmitted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "zoneId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "description",
        "type": "string"
      }
    ],
    "name": "ZoneRegistered",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_projectId",
        "type": "uint256"
      }
    ],
    "name": "approveProject",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_planner",
        "type": "address"
      }
    ],
    "name": "authorizePlanner",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_zoneId",
        "type": "uint256"
      }
    ],
    "name": "calculateDevelopmentPotential",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_zoneId1",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_zoneId2",
        "type": "uint256"
      }
    ],
    "name": "compareZoneValues",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalProjects",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalZones",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_projectId",
        "type": "uint256"
      }
    ],
    "name": "getProjectPublicInfo",
    "outputs": [
      {
        "internalType": "bool",
        "name": "isApproved",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "proposer",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "projectName",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "targetZoneId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "submissionTime",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_zoneId",
        "type": "uint256"
      }
    ],
    "name": "getZonePublicInfo",
    "outputs": [
      {
        "internalType": "bool",
        "name": "isRegistered",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "publicDescription",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "registrationTime",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "_area",
        "type": "uint32"
      },
      {
        "internalType": "uint32",
        "name": "_population",
        "type": "uint32"
      },
      {
        "internalType": "uint32",
        "name": "_value",
        "type": "uint32"
      },
      {
        "internalType": "uint16",
        "name": "_zoningType",
        "type": "uint16"
      },
      {
        "internalType": "string",
        "name": "_publicDescription",
        "type": "string"
      }
    ],
    "name": "registerLandZone",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_zoneId",
        "type": "uint256"
      }
    ],
    "name": "requestUrbanAnalysis",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_planner",
        "type": "address"
      }
    ],
    "name": "revokePlannerAuthorization",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "_budget",
        "type": "uint32"
      },
      {
        "internalType": "uint16",
        "name": "_impactScore",
        "type": "uint16"
      },
      {
        "internalType": "uint32",
        "name": "_timeline",
        "type": "uint32"
      },
      {
        "internalType": "string",
        "name": "_projectName",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_targetZoneId",
        "type": "uint256"
      }
    ],
    "name": "submitPlanningProject",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_zoneId",
        "type": "uint256"
      },
      {
        "internalType": "uint32",
        "name": "_densityIndex",
        "type": "uint32"
      },
      {
        "internalType": "uint32",
        "name": "_trafficVolume",
        "type": "uint32"
      },
      {
        "internalType": "uint16",
        "name": "_greenSpaceRatio",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "_infrastructureScore",
        "type": "uint16"
      }
    ],
    "name": "updateDevelopmentMetrics",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;
