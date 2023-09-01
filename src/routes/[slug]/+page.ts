import { error } from '@sveltejs/kit'
import { db } from '../../hooks.server.js';

export async function load({ data }) {
    
    return {
        data: data
    }
}