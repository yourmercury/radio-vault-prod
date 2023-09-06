import { Metadata } from "next"

export type Vault = {
    id: string
    controller: string
    storageURL: string
    title: string
    description: string
    metadata: NFTMetadata
    contracts: string[]
    regions: string[]
    shares: number
    month?: string
    vys?: any
    deploymentCount: number
    streams: number
    createdAt: string | number
    updatedAt: string | number
}

export type MetadataSchema = {
    description: string,
    image: Blob | File,
    media: Blob | File,
    media_type: string,
    mime_type?: string,
    name: string,
    attributes: { trait_type?: string, value: any }[]
    genre?: string,
    license?: string,
    collaborators?: {name: string, role: string, external_url: string, radio_vault_profile_url?: string}[]
    creator?: {name: string, role: string, external_url: string, radio_vault_profile_url?: string}
    external_url: string,
}

export type NFTMetadata = {
    description: string,
    image: string,
    media: string,
    media_type: string,
    mime_type?: string,
    name: string,
    attributes: { trait_type?: string, value: any }[]
    genre?: string,
    license?: string,
    collaborators?: {name: string, role: string, external_url: string, radio_vault_profile_url?: string}[]
    creator?: {name: string, role: string, external_url: string, radio_vault_profile_url?: string}
    external_url: string,
}

export type Deployed = {
    contractAddress: string;
    txHash: string
    vaultId: string;
    chain: {id: number, name: string, explorer: string},
    createdAt: string,
    updatedAt: string,
}

export const orderByTypes = ["createdAt", "updatedAt", "streams", "shares"];