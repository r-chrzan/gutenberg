/**
 * WordPress dependencies
 */
import { useRef, useEffect } from '@wordpress/element';
import { __experimentalHeading as Heading } from '@wordpress/components';
import { focus } from '@wordpress/dom';

/**
 * Internal dependencies
 */
import MediaList from './media-list';
import { useMediaResults } from './hooks';

export function MediaCategoryDialog( { rootClientId, onInsert, category } ) {
	const container = useRef();
	useEffect( () => {
		const timeout = setTimeout( () => {
			const [ firstTabbable ] = focus.tabbable.find( container.current );
			firstTabbable?.focus();
		} );
		return () => clearTimeout( timeout );
	}, [ category ] );

	const results = useMediaResults( category );

	// const showOpenverse = category.name === 'openverse';
	// TODO: should probably get the media here..(?)
	return (
		<div ref={ container } className="block-editor-inserter__media-panel">
			<MediaCategoryPanel
				rootClientId={ rootClientId }
				onInsert={ onInsert }
				category={ category }
				results={ results }
			/>
		</div>
	);
}

export function MediaCategoryPanel( {
	rootClientId,
	onInsert,
	category,
	results,
} ) {
	// TODO: add loader probably..
	return (
		<div>
			<Heading level="4" weight="400">
				{ category.label }
			</Heading>
			{ !! results.length && (
				<MediaList
					rootClientId={ rootClientId }
					onClick={ onInsert }
					results={ results }
					mediaType={ category.mediaType }
					isOpenverse={ category.name === 'openverse' }
				/>
			) }
		</div>
	);
}
