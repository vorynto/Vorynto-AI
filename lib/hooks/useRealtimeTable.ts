"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Subscribe to realtime Postgres changes for a single table,
 * scoped to a tenant_id filter.
 *
 * Returns { data, setData, merge, connected } where:
 *  - data = merged live array (insert/update/delete applied automatically)
 *  - setData = escape hatch for manual overrides
 *  - merge = upsert a single row into local state
 *  - connected = true once the channel is SUBSCRIBED
 */
export function useRealtimeTable<T extends { id: string }>(
  table: string,
  tenantId: string | null,
  initialData: T[]
) {
  const [data, setData] = useState<T[]>(initialData);
  const [connected, setConnected] = useState(false);

  // Stay in sync if the server re-renders with fresh initial data
  // Compare by ID list only to avoid deep-equality thrash
  useEffect(() => {
    setData(initialData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initialData.map((r) => r.id))]);

  useEffect(() => {
    if (!tenantId) return;
    const supabase = createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const channel = (supabase as any)
      .channel(`rt-${table}-${tenantId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table,
          filter: `tenant_id=eq.${tenantId}`,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: any) => {
          if (payload.eventType === "INSERT") {
            setData((prev) => [payload.new as T, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setData((prev) =>
              prev.map((row) =>
                row.id === (payload.new as T).id ? (payload.new as T) : row
              )
            );
          } else if (payload.eventType === "DELETE") {
            setData((prev) =>
              prev.filter((row) => row.id !== payload.old?.id)
            );
          }
        }
      )
      .subscribe((status: string) => {
        setConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
      setConnected(false);
    };
  }, [table, tenantId]);

  const merge = useCallback(
    (updated: T) =>
      setData((prev) =>
        prev.some((r) => r.id === updated.id)
          ? prev.map((r) => (r.id === updated.id ? updated : r))
          : [updated, ...prev]
      ),
    []
  );

  return { data, setData, merge, connected };
}
