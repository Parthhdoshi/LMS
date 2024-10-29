import { apiSlice } from "../api/apiSlice";
export const maintenance = apiSlice.injectEndpoints({
    endpoints : (builder) => ({
        getMaintenanceStatus : builder.query({
            query : () => ({
                url : `get-maintenance-status`,
                method : "GET",
                credentials: "include" as const,
            })
        })
    })
})

export const { useGetMaintenanceStatusQuery } = maintenance