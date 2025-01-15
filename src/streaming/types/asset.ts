/**
 * Storage types supported by Dolby.
 */
export type MediaAssetStorageType = "awsS3" | "gcs" | "dolbyStorage"; // Valid storage types

/**
 * Additional options for the storage location.
 */
export interface UpdateStorageOptionsModel {
    objectPrefix?: string | null; // Optional, prefix to prepend to assets names in storage.
    bucketName?: string | null; // Optional, name of the bucket to use for storage.
    bucketRegion?: string | null; //Optional, region of the bucket to use for storage.
}

/**
 * The allowable parameters for updating the storage location of an asset when requesting clip creation.
 */
export interface MediaAssetStorageModel {
    profileId?: string | null; // The id of a previously created storage profile.
    type?: MediaAssetStorageType | null; // The type of storage to use.
    options?: UpdateStorageOptionsModel | null; // Additional options for the storage location.
    expiration?: string | null; // ISO 8601 date string, only used for DolbyIO storage. Sets the date to delete the asset automatically.
}

/**
 * The allowable parameters for requesting the creation of an asset clip.
 */
export interface CreateAssetClipRequest {
    streamName: string; // Required, length ≥ 1, Name of the stream you want to clip.
    tokenId?: number | null; // Optional, Token ID of the stream you want to clip.
    sourceId?: string | null; // Optional
    simulcastId?: string | null; // Optional, Simulcast ID if required.
    priority?: number | null; // Optional, int32, The requests with the highest priority are processed first.
    startTime: string; // Required, ISO 8601 date string, Start time of the clip.
    stopTime?: string | null; // Optional, ISO 8601 date string, End time of the clip. If not required defaults to current time.
    name?: string | null; // Optional, Name of the asset once clipped. If not provided it will be generated.
    storage?: MediaAssetStorageModel | null; // Optional
}

/**
 * Response data for the Clip storage.
 */
export interface MediaAssetStorageResponseModel {
    type: MediaAssetStorageType;
    path?: string | null; // Optional, Path to clip storage location
}

/**
 * Response Data for the Metadata for a clip.
 */
export interface RecordMetadata {
    format: string; // Format of the clip
    sizes?: Record<string, any> | null; // Optional, additional fields expected, sizes available.
    duration: number; // Duration in seconds of clip.
    tracks: {
        type: string; // Track type
        codec: string; // Track Codec
        bitrate: number; // Bitrate of the track.
        width?: number | null; // Optional, int32, Width of track.
        height?: number | null; // Optional, int32 Height of track.
        framerate?: number | null; // Optional, int32, Framerate of Track.
        channels?: number | null; // Optional, int32, Number of channels.
        samplerate?: number | null; // Optional, int64, Sample rate of track.
    }[];
    thumbnails: string[]; // Array of thumbnail URLs
}

/**
 * Response data for the feed selection from where the clip was created.
 *
 */
export interface MediaAssetFeedSelectionModel {
    tokenId?: number | null; // Optional, Token ID of the stream if provided.
    streamName: string; // Required, The name of the stream the clip belongs to.
    sourceId?: string | null; // Optional, The SourceId of the stream the clip belongs to.
    simulcastId?: string | null; // Optional, The simulcastId of the stream the clip belongs to.
    priority?: number | null; // Optional, int32, the priority of the clip request.
}

/**
 * Response data for a clip.
 */
export interface AssetResponseData {
    id?: string | null; // Optional, ID of the object.
    type: "recording" | "clip" | "storageValidation" | "timeline" | "feed"; // Required, type of the object.
    feed?: MediaAssetFeedSelectionModel; // Optional, information about the asset.
    startTime: string; // Required, ISO 8601 date string, Start time of clip.
    stopTime?: string | null; // Optional, ISO 8601 date string, End time of clip.
    name?: string; //Name of the asset.
    storage: MediaAssetStorageResponseModel;
    status: "processing" | "complete" | "error" | "deleting" | "deleted"; // The status of the Clip request.
    error?: string | null; // Optional, error details
    created?: string | null; // Optional, ISO 8601 date string, Created Date.
    expiration?: string | null; // Optional, ISO 8601 date string, Expiration Date.
    removed?: string | null; // Optional, ISO 8601 date string, Deleted Date.
    metadata?: RecordMetadata
}

/**
 * The allowable sort options for listing media assets.
 */
type ListMediaAssetSortBy = "startTime" | "endTime" | "name"; // Add other valid sort options as needed

/**
 * The allowable parameters for listing and filtering media assets.
 */
export interface ListMediaAssetsQueryParams {
    sort?: ListMediaAssetSortBy; // Defaults to "startTime"
    status?: string[] | null; // Defaults to ["Processing", "Complete"] unless specified
    type?: string[] | null; // Defaults to ["Clip", "Recording"] unless specified
    name?: string | null; // Optional. Filter by media asset name
    streamName?: string | null; // Optional, Name of the stream to filter by.
    tokenId?: number | null; // Optional, Token ID of the stream to filter by.
    sourceId?: string | null; // Optional, Source ID of the stream to filter by.
    simulcastId?: string | null; // Optional, with behavior for empty string, Simulcast ID of the stream to filter by.
    priority?: number | null; // Optional, int32, Priority of the clip request to filter by.
    page?: number; // Optional, integer, 1 to 2147483647, defaults to 1
    limit?: number; // Optional, integer, 1 to 100, defaults to 25
    desc?: boolean; // Optional, defaults to false, sort descending boolean.
}
