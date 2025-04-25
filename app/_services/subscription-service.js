import { fetchWithAuth } from "./base-service";

export async function getUserSubscription(){
    return fetchWithAuth(`/subscription`)
};