import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

// Infer types for the API request and response
type ResponseType = InferResponseType<typeof client.api.account.$post>;
type RequestType = InferRequestType<typeof client.api.account.$post>["json"];

export const useCreateAccount = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.account.$post({ json });

            // Check if the response is OK (status code 2xx)
            if (!response.ok) {
                throw new Error("Failed to create account");
            }

            // Parse and return the JSON response
            return await response.json();
        },
        onSuccess: () => {
            // Show success toast
            toast.success("Account created");

            // Invalidate the "accounts" query to refetch the list
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
        },
        onError: (error) => {
            // Show error toast
            toast.error("Failed to create account");

            // Log the error for debugging
            console.error("Error creating account:", error);
        },
    });

    return mutation;
};