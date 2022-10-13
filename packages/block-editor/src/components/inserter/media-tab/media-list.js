/**
 * WordPress dependencies
 */
// import { useMemo, useCallback } from '@wordpress/element';
// import { useInstanceId } from '@wordpress/compose';
import {
	__unstableComposite as Composite,
	__unstableUseCompositeState as useCompositeState,
	__unstableCompositeItem as CompositeItem,
} from '@wordpress/components';
import { createBlock } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
/**
 * Internal dependencies
 */
import InserterDraggableBlocks from '../../inserter-draggable-blocks';
import BlockPreview from '../../block-preview';

function getBlocksPreview( media, mediaType, isOpenverse ) {
	let attributes;
	// TODO: check all the needed attributes(alt, caption, etc..)
	if ( mediaType === 'image' ) {
		attributes = isOpenverse
			? { url: media.thumbnail || media.url }
			: {
					id: media.id,
					url: media.source_url,
			  };
	} else if ( mediaType === 'video' || mediaType === 'audio' ) {
		attributes = {
			id: media.id,
			src: media.source_url,
		};
	}

	const blocks = createBlock( `core/${ mediaType }`, attributes );
	return blocks;
}

function MediaPreview( { media, onClick, composite, mediaType, isOpenverse } ) {
	// TODO: Check caption or attribution, etc..
	// TODO: create different blocks per media type..
	const blocks = getBlocksPreview( media, mediaType, isOpenverse );
	// TODO: we have to set a max height for previews as the image can be very tall.
	// Probably a fixed-max height for all(?).
	const title = media.title?.rendered || media.title;
	const baseCssClass = 'block-editor-inserter__media-list';
	// const descriptionId = useInstanceId(
	// 	MediaPreview,
	// 	`${ baseCssClass }__item-description`
	// );
	return (
		<InserterDraggableBlocks isEnabled={ true } blocks={ [ blocks ] }>
			{ ( { draggable, onDragStart, onDragEnd } ) => (
				<div
					className={ `${ baseCssClass }__list-item` }
					draggable={ draggable }
					onDragStart={ onDragStart }
					onDragEnd={ onDragEnd }
				>
					<CompositeItem
						role="option"
						as="div"
						{ ...composite }
						className={ `${ baseCssClass }__item` }
						onClick={ () => {
							// TODO: We need to handle the case with focus to image's caption
							// during insertion. This makes the inserter to close.
							onClick( blocks );
						} }
						aria-label={ title }
						// aria-describedby={}
					>
						<BlockPreview blocks={ blocks } viewportWidth={ 400 } />
						<div className={ `${ baseCssClass }__item-title` }>
							{ title }
						</div>
						{ /* { !! description && (
							<VisuallyHidden id={ descriptionId }>
								{ description }
							</VisuallyHidden>
						) } */ }
					</CompositeItem>
				</div>
			) }
		</InserterDraggableBlocks>
	);
}

function MediaList( {
	isOpenverse,
	results,
	mediaType,
	onClick,
	label = __( 'Media List' ),
} ) {
	const composite = useCompositeState();
	// const blocks = useMemo( () => {
	// 	// TODO: Check caption or attribution, etc..
	// 	// TODO: create different blocks per media type..
	// 	// const blockss = getBlocksPreview( media, mediaType, isOpenverse );
	// 	// return blockss;
	// }, [] );
	// const onClickItem = useCallback( () => {}, [] );
	return (
		<Composite
			{ ...composite }
			role="listbox"
			className="block-editor-inserter__media-list"
			aria-label={ label }
		>
			{ results.map( ( media ) => (
				<MediaPreview
					key={ media.id }
					media={ media }
					mediaType={ mediaType }
					onClick={ onClick }
					composite={ composite }
					isOpenverse={ isOpenverse }
				/>
			) ) }
		</Composite>
	);
}

export default MediaList;
