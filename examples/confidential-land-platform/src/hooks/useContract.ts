import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../lib/contract';

export function useContractWrite() {
  const { writeContractAsync, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return {
    writeContractAsync,
    hash,
    error,
    isPending,
    isConfirming,
    isConfirmed,
  };
}

export function useContractRead(functionName: any, args?: any) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: functionName as any,
    args: args as any,
  });
}

export function useTotalZones() {
  return useContractRead('getTotalZones');
}

export function useTotalProjects() {
  return useContractRead('getTotalProjects');
}

export function useZoneInfo(zoneId: number | undefined) {
  return useContractRead('getZonePublicInfo', zoneId !== undefined ? [BigInt(zoneId)] : undefined);
}

export function useProjectInfo(projectId: number | undefined) {
  return useContractRead('getProjectPublicInfo', projectId !== undefined ? [BigInt(projectId)] : undefined);
}
