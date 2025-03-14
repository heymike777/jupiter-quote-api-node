/* tslint:disable */
/* eslint-disable */
/**
 * Swap API
 * The heart and soul of Jupiter lies in the Quote and Swap API.  ### API Rate Limit Since 1 December 2024, we have updated our API structure. Please refer to [Station](https://station.jup.ag/docs/) for further details on usage and rate limits.  ### API Usage - API Wrapper Typescript [@jup-ag/api](https://github.com/jup-ag/jupiter-quote-api-node)  ### Data Types To Note - Public keys are base58 encoded strings - Raw data such as Vec<u8\\> are base64 encoded strings 
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface SwapResponsePrioritizationTypeJito
 */
export interface SwapResponsePrioritizationTypeJito {
    /**
     * 
     * @type {number}
     * @memberof SwapResponsePrioritizationTypeJito
     */
    lamports?: number;
}

/**
 * Check if a given object implements the SwapResponsePrioritizationTypeJito interface.
 */
export function instanceOfSwapResponsePrioritizationTypeJito(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function SwapResponsePrioritizationTypeJitoFromJSON(json: any): SwapResponsePrioritizationTypeJito {
    return SwapResponsePrioritizationTypeJitoFromJSONTyped(json, false);
}

export function SwapResponsePrioritizationTypeJitoFromJSONTyped(json: any, ignoreDiscriminator: boolean): SwapResponsePrioritizationTypeJito {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'lamports': !exists(json, 'lamports') ? undefined : json['lamports'],
    };
}

export function SwapResponsePrioritizationTypeJitoToJSON(value?: SwapResponsePrioritizationTypeJito | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'lamports': value.lamports,
    };
}

