import { Actor, HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { idlFactory as evote_backend_idl } from "../declarations/evote_backend/evote_backend.did.js";

// Create an actor with the canister ID
export const createActor = (canisterId, options = {}) => {
  const agent = options.agent || new HttpAgent({ ...options.agentOptions });

  if (process.env.NODE_ENV !== "production") {
    agent.fetchRootKey().catch((err) => {
      console.warn("Unable to fetch root key. Check if your local replica is running");
      console.error(err);
    });
  }

  return Actor.createActor(evote_backend_idl, {
    agent,
    canisterId,
    ...options.actorOptions,
  });
};

// Initialize the auth client
export const initAuth = async () => {
  return await AuthClient.create();
};

// Get the backend canister ID
export const getCanisterId = () => {
  return process.env.EVOTE_BACKEND_CANISTER_ID || "rrkah-fqaaa-aaaaa-aaaaq-cai"; // Default local canister ID
};

// Create an actor connected to the backend
export const getBackendActor = async (authClient) => {
  const identity = authClient.getIdentity();
  return createActor(getCanisterId(), {
    agentOptions: {
      identity,
    },
  });
};
