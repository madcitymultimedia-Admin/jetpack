/**
 * External dependencies
 */
import { BlockIcon, MediaPlaceholder } from '@wordpress/block-editor';
import { useDispatch } from '@wordpress/data';
import { useCallback, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { isURL, getProtocol } from '@wordpress/url';
/**
 * Internal dependencies
 */
import { buildVideoPressURL } from '../../../../../lib/url';
import { VIDEOPRESS_VIDEO_ALLOWED_MEDIA_TYPES } from '../../constants';
import { title } from '../../index';
import { VideoPressIcon } from '../icons';
import UploadProgress from './uploader-progress';
import './style.scss';

const VideoPressUploader = ( { handleDoneUpload, isInteractionDisabled } ) => {
	const [ uploadFile, setFile ] = useState( null );
	const [ isUploadingInProgress, setIsUploadingInProgress ] = useState( false );
	const { createErrorNotice } = useDispatch( noticesStore );

	const onSelectURL = useCallback(
		( videoSource, id ) => {
			// If the video source is a VideoPress URL, we can use it directly.
			const { guid, url: videoPressURL } = buildVideoPressURL( videoSource );
			if ( ! guid ) {
				createErrorNotice( __( 'Invalid VideoPress URL', 'jetpack-videopress-pkg' ) );
				return;
			}
			handleDoneUpload( { guid, src: videoPressURL, id } );
		},
		[ createErrorNotice, handleDoneUpload ]
	);

	const onSelectVideo = useCallback(
		media => {
			const isUploadingFile =
				media?.url && isURL( media?.url ) && getProtocol( media?.url ) === 'file:' && media?.type;

			// Upload local file.
			if ( isUploadingFile ) {
				setFile( media );
				setIsUploadingInProgress( true );
				return;
			}

			// Insert media library VideoPress attachment.
			const videoPressGuid = media?.videopressGUID;
			if ( videoPressGuid ) {
				onSelectURL( videoPressGuid, media?.id );
				return;
			}
			// eslint-disable-next-line no-console
			console.error( `Media item with ID ${ media?.id } can't be added.` );
		},
		[ onSelectURL ]
	);

	const onResetUpload = useCallback( () => {
		setIsUploadingInProgress( false );
	}, [] );

	if ( isUploadingInProgress ) {
		return (
			<UploadProgress
				file={ uploadFile }
				onDone={ handleDoneUpload }
				onReset={ onResetUpload }
				isInteractionDisabled={ isInteractionDisabled }
			/>
		);
	}

	return (
		<MediaPlaceholder
			icon={ <BlockIcon icon={ VideoPressIcon } /> }
			labels={ {
				title,
			} }
			onSelect={ onSelectVideo }
			onSelectURL={ onSelectURL }
			allowedTypes={ VIDEOPRESS_VIDEO_ALLOWED_MEDIA_TYPES }
			autoOpenMediaUpload
		/>
	);
};

export default VideoPressUploader;
