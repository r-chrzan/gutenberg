/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { store as blockEditorStore } from '../../../store';

// TODO: Even though the `mature` param is `false` by default, we might need to determine where
// and if there is other 'weird' content like in the title. It happened for me to test with `skate`
// and the first result contains a word in the title that might not be suitable for all users.
async function fetchFromOpenverse( { search, pageSize = 10 } ) {
	const controller = new AbortController();
	const url = new URL( 'https://api.openverse.engineering/v1/images/' );
	// TODO: add licence filters etc..
	url.searchParams.set( 'q', search );
	url.searchParams.set( 'page_size', pageSize );
	const response = await window.fetch( url, {
		headers: [ [ 'Content-Type', 'application/json' ] ],
		signal: controller.signal,
	} );
	return response.json();
}

export function useMediaResults( category, options = {} ) {
	const [ results, setResults ] = useState( [] );
	const settings = useSelect(
		( select ) => select( blockEditorStore ).getSettings(),
		[]
	);
	const isOpenverse = category.name === 'openverse';
	useEffect( () => {
		( async () => {
			// TODO: add loader probably and not set results..
			setResults( [] );
			try {
				if ( isOpenverse ) {
					const response = await fetchFromOpenverse( options );
					setResults( response.results );
				} else {
					const _media = await settings?.__unstableFetchMedia( {
						per_page: 7,
						media_type: category.mediaType,
					} );
					if ( _media ) setResults( _media );
				}
			} catch ( error ) {
				// TODO: handle this
				throw error;
			}
		} )();
	}, [ category?.name, ...Object.values( options ) ] );

	return results;
}

// TODO: Need to think of the props.. :)
const MEDIA_CATEGORIES = [
	{ label: __( 'Images' ), name: 'images', mediaType: 'image' },
	{ label: __( 'Videos' ), name: 'videos', mediaType: 'video' },
	{ label: __( 'Audio' ), name: 'audio', mediaType: 'audio' },
	{ label: 'Openverse', name: 'openverse', mediaType: 'image' },
];
// TODO: definitely revisit the implementation and probably add a loader(return loading state)..
export function useMediaCategories( rootClientId ) {
	const [ categories, setCategories ] = useState( [] );
	const { canInsertImage, canInsertVideo, canInsertAudio, fetchMedia } =
		useSelect(
			( select ) => {
				const { canInsertBlockType, getSettings } =
					select( blockEditorStore );
				return {
					fetchMedia: getSettings().__unstableFetchMedia,
					canInsertImage: canInsertBlockType(
						'core/image',
						rootClientId
					),
					canInsertVideo: canInsertBlockType(
						'core/video',
						rootClientId
					),
					canInsertAudio: canInsertBlockType(
						'core/audio',
						rootClientId
					),
				};
			},
			[ rootClientId ]
		);
	useEffect( () => {
		( async () => {
			const query = {
				context: 'view',
				per_page: 1,
				_fields: [ 'id' ],
			};
			const [ showImage, showVideo, showAudio ] = await Promise.all( [
				canInsertImage &&
					!! (
						await fetchMedia( {
							...query,
							media_type: 'image',
						} )
					 ).length,
				canInsertVideo &&
					!! (
						await fetchMedia( {
							...query,
							media_type: 'video',
						} )
					 ).length,
				canInsertAudio &&
					!! (
						await fetchMedia( {
							...query,
							media_type: 'audio',
						} )
					 ).length,
			] );
			setCategories(
				MEDIA_CATEGORIES.filter(
					( { mediaType } ) =>
						( mediaType === 'image' && showImage ) ||
						( mediaType === 'video' && showVideo ) ||
						( mediaType === 'audio' && showAudio )
				)
			);
		} )();
	}, [ canInsertImage, canInsertVideo, canInsertAudio, fetchMedia ] );
	return categories;
}
