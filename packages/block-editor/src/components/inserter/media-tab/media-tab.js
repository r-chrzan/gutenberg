/**
 * External dependencies
 */
import classNames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useViewportMatch } from '@wordpress/compose';
import {
	__experimentalItemGroup as ItemGroup,
	__experimentalItem as Item,
	__experimentalHStack as HStack,
	// __experimentalNavigatorProvider as NavigatorProvider,
	// __experimentalNavigatorScreen as NavigatorScreen,
	// __experimentalNavigatorButton as NavigatorButton,
	// __experimentalNavigatorBackButton as NavigatorBackButton,
	FlexBlock,
	Button,
	__unstableComposite as Composite,
	__unstableUseCompositeState as useCompositeState,
	__unstableCompositeItem as CompositeItem,
} from '@wordpress/components';
import { Icon, chevronRight } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import MediaUploadCheck from '../../media-upload/check';
import MediaUpload from '../../media-upload';
import { useMediaCategories } from './hooks';

function MediaTab( { rootClientId, selectedCategory, onSelectCategory } ) {
	// TODO: check here if media exists for each type('image,audio, etc..) and conditionally render the tabs.
	// We should probably pass the media(?) - check with search implementation.
	const mediaCategories = useMediaCategories( rootClientId );
	const isMobile = useViewportMatch( 'medium', '<' );
	const composite = useCompositeState();
	const baseCssClass = 'block-editor-inserter__media-tabs';
	return (
		<>
			{ ! isMobile && (
				<div className={ `${ baseCssClass }-container` }>
					<Composite
						{ ...composite }
						role="listbox"
						className={ baseCssClass }
						as={ ItemGroup }
						label={ __( 'Media categories' ) } // TODO: check this label..
					>
						{ mediaCategories.map( ( mediaCategory ) => (
							<CompositeItem
								role="option"
								as={ Item }
								{ ...composite }
								key={ mediaCategory.name }
								onClick={ () =>
									onSelectCategory( mediaCategory )
								}
								className={ classNames(
									`${ baseCssClass }__media-category`,
									{
										'is-selected':
											selectedCategory === mediaCategory,
									}
								) }
								aria-label={ mediaCategory.label }
							>
								<HStack>
									<FlexBlock>
										{ mediaCategory.label }
									</FlexBlock>
									<Icon icon={ chevronRight } />
								</HStack>
							</CompositeItem>
						) ) }
					</Composite>
				</div>
			) }
			<MediaUploadCheck>
				<MediaUpload
					// className="block-editor-inserter__media-library-button"
					// gallery={ false }
					// addToGallery={ addToGallery }
					multiple={ false }
					// value={ multiple ? mediaIds : mediaId }
					// onSelect={ ( media ) => selectMedia( media, onClose ) }
					// onSelect={ ( _media ) => {
					// 	const aaa = _media;
					// } }
					// mode={ 'browse' }
					// allowedTypes={ [ 'image' ] }
					render={ ( {} ) => (
						<Button
							// onClick={ open }
							className="block-editor-inserter__media-library-button"
							variant="secondary"
						>
							{ __( 'Open Media Library' ) }
						</Button>
					) }
				/>
			</MediaUploadCheck>
			{ isMobile && (
				<MediaTabNavigation
				// onInsert={ onInsert }
				// rootClientId={ rootClientId }
				/>
			) }
		</>
	);
}

function MediaTabNavigation() {
	return 'make mobile..';
}

export default MediaTab;
