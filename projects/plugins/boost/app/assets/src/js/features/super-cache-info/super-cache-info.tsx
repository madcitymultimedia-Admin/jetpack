import React, { useState } from 'react';
import { useDataSync } from '@automattic/jetpack-react-data-sync-client';
import { __, sprintf } from '@wordpress/i18n';
import { Notice, Button } from '@automattic/jetpack-components';
import {
	measureSuperCacheSaving,
	isSuperCachePluginActive,
	isSuperCacheEnabled,
} from '$lib/utils/measure-super-cache-saving';
import { z } from 'zod';
type State = {
	status: 'idle' | 'testing' | 'error' | 'complete';
	error?: string;
	saving?: number;
};

const SuperCacheInfo = () => {
	const [ state, setState ] = useState< State >( { status: 'idle' } );

	const [ { data: isNoticeDismissed }, { mutate: setNoticeDismissed } ] = useDataSync(
		'jetpack_boost_ds',
		'super_cache_notice_disabled',
		z.boolean()
	);

	const runTest = async () => {
		setState( { status: 'testing' } );
		try {
			const saving = await measureSuperCacheSaving();
			setState( { status: 'complete', saving } );
		} catch ( error ) {
			setState( { status: 'error', error } );
		}
	};

	const navToSuperCacheSettings = () => {
		window.location.href = './options-general.php?page=wpsupercache';
	};

	// Function to render action button
	const renderActionButton = (
		key: string,
		label: string,
		onClick: () => void,
		isLoading = false
	) => (
		<Button key={ key } isPrimary onClick={ onClick } isLoading={ isLoading }>
			{ label }
		</Button>
	);

	if ( ! isSuperCachePluginActive() ) {
		return null;
	}

	if ( ! isSuperCacheEnabled() ) {
		if ( isNoticeDismissed ) {
			return null;
		}

		return (
			<Notice
				level="warning"
				title={ __( 'Super Cache is installed but not enabled', 'jetpack-boost' ) }
				actions={ [
					renderActionButton( 'start', __( 'Set up', 'jetpack-boost' ), navToSuperCacheSettings ),
				] }
				hideCloseButton={ false }
				onClose={ () => {
					setNoticeDismissed( true );
				} }
			>
				{ __( 'Enable Super Cache to speed your site up further.', 'jetpack-boost' ) }
			</Notice>
		);
	}

	return (
		<>
			{ state.status === 'testing' && (
				<Notice
					level="info"
					title={ __( 'Measuring Super Cache Speed', 'jetpack-boost' ) }
					hideCloseButton={ true }
					actions={ [
						renderActionButton( 'running', __( 'Run test', 'jetpack-boost' ), () => {}, true ),
					] }
				>
					<p>{ __( 'Jetpack Boost is testing the speed of your cache.', 'jetpack-boost' ) }</p>
				</Notice>
			) }
			{ state.status === 'idle' && (
				<Notice
					level="info"
					title={ __( 'Super Cache detected', 'jetpack-boost' ) }
					hideCloseButton={ true }
					actions={ [ renderActionButton( 'start', __( 'Run test', 'jetpack-boost' ), runTest ) ] }
				>
					<p>{ __( 'Find out how much difference it makes for your users.', 'jetpack-boost' ) }</p>
				</Notice>
			) }
			{ state.status === 'complete' && (
				<Notice
					level="success"
					title={ __( 'Super Cache Speed', 'jetpack-boost' ) }
					hideCloseButton={ true }
					actions={ [
						renderActionButton( 'start', __( 'Re-run test', 'jetpack-boost' ), runTest ),
					] }
				>
					<p>
						{ sprintf(
							// translators: %d refers to the number of milliseconds users are saving by using Super Cache.
							__( 'Super Cache is saving your visitors about %d ms', 'jetpack-boost' ),
							state.saving
						) }
					</p>
				</Notice>
			) }
			{ state.status === 'error' && (
				<Notice
					level="error"
					title={ __( 'Super Cache Speed', 'jetpack-boost' ) }
					hideCloseButton={ true }
					actions={ [
						renderActionButton( 'start', __( 'Re-run test', 'jetpack-boost' ), runTest ),
					] }
				>
					<p>
						{ sprintf(
							// translators: %s refers to the error message returned by the Super Cache test.
							__( 'We ran into an error measuring your speed: %s', 'jetpack-boost' ),
							state.error
						) }
					</p>
				</Notice>
			) }
		</>
	);
};

export default SuperCacheInfo;
