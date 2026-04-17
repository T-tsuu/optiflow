// Stubbed Supabase data hooks. Each one is wired to mock data today and
// can be swapped to live `supabase.from(...)` queries when Cloud is enabled.
import { useEffect, useState } from "react";
import {
  manufacturingOrders,
  stockItems,
  stockMovements,
  transferRequests,
  clients,
  commercialOrders,
  serviceTickets,
  machines,
  users,
  type ManufacturingOrder,
  type StockItem,
  type StockMovement,
  type TransferRequest,
  type Client,
  type CommercialOrder,
  type ServiceTicket,
  type Machine,
  type User,
} from "./mockData";

function useMock<T>(data: T): { data: T; loading: boolean } {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 120);
    return () => clearTimeout(t);
  }, []);
  return { data, loading };
}

export const useManufacturingOrders = () => useMock<ManufacturingOrder[]>(manufacturingOrders);
export const useStockItems         = () => useMock<StockItem[]>(stockItems);
export const useStockMovements     = () => useMock<StockMovement[]>(stockMovements);
export const useTransferRequests   = () => useMock<TransferRequest[]>(transferRequests);
export const useClients            = () => useMock<Client[]>(clients);
export const useCommercialOrders   = () => useMock<CommercialOrder[]>(commercialOrders);
export const useServiceTickets     = () => useMock<ServiceTicket[]>(serviceTickets);
export const useMachines           = () => useMock<Machine[]>(machines);
export const useUsers              = () => useMock<User[]>(users);
