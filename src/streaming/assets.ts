import * as Urls from '../urls';
import {
    CreateAssetClipRequest,
    ListMediaAssetsQueryParams,
    AssetResponseData,
} from './types/asset';
import { sendDelete, sendGet, sendPost } from './internal/httpHelpers';

/**
 * Creates a new media asset.
 * @link https://docs.dolby.io/streaming-apis/reference/media-assets-post
 * @param apiSecret The API Secret used to authenticate this request.
 * @param clipRequest The request body for creating a new media asset.
 * @param idempotencyKey Optional, The unique identifier for this request to prevent duplicate submissions.
 */
export const create = async (apiSecret: string, clipRequest: CreateAssetClipRequest, idempotencyKey?: string,) => {
    const options = {
        hostname: Urls.getRtsHostname(),
        path: `/api/v3/media/assets`,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiSecret}`,
            'Idempotency-Key': idempotencyKey
        },
        body: JSON.stringify(clipRequest),
    }

    return await sendPost<AssetResponseData>(options);
}

/**
 * Lists media assets.
 * @link https://docs.dolby.io/streaming-apis/reference/media-assets-get
 * @param apiSecret The API Secret used to authenticate this request.
 * @param params Query parameters for filtering the list of media assets.
 */
export const list = async (apiSecret: string, params: ListMediaAssetsQueryParams) => {
    const options = {
        hostname: Urls.getRtsHostname(),
        path: "/api/v3/media/assets",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiSecret}`
        },
        params: toDictString(params),
    };

    return await sendGet<AssetResponseData[]>(options);
}

/**
 * Deletes multiple media assets from storage.
 * @link https://docs.dolby.io/streaming-apis/reference/media-assets-delete
 * @param apiSecret The API Secret used to authenticate this request.
 * @param assetIds The list of asset IDs to delete.
 */
export const deleteAssets = async (apiSecret: string, assetIds: string[]) => {
    const options = {
        hostname: Urls.getRtsHostname(),
        path: "api/v3/media/assets",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiSecret}`
        },
        params: toDictString(assetIds)
    };

    return await sendDelete(options);
}

/**
 * Reads a media asset.
 * @link https://docs.dolby.io/streaming-apis/reference/media-assets-mediaassetid-get
 * @param apiSecret The API Secret used to authenticate this request.
 * @param assetId The ID of the media asset to read.
 */
export const read = async (apiSecret: string, assetId: string) => {
    const options = {
        hostname: Urls.getRtsHostname(),
        path: `/api/v3/media/assets/${assetId}`,
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${apiSecret}`
        }
    };

    return await sendGet<AssetResponseData>(options);
}

type Dict<T> = { [key: string]: T };

function toDictString(obj: Record<string, any>): Dict<string> {
    const result: Dict<string> = {};
    for (const [key, value] of Object.entries(obj)) {
        result[key] = String(value); // Ensure all values are converted to strings
    }
    return result;
}
