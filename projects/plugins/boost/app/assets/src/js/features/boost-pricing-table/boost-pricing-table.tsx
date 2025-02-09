import { ConfigType, useConfig } from '$lib/stores/config-ds';
import {
	Button,
	getRedirectUrl,
	PricingTable,
	PricingTableColumn,
	PricingTableHeader,
	PricingTableItem,
	ProductPrice,
} from '@automattic/jetpack-components';
import { createInterpolateElement } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const cssOptimizationContext = __(
	'Move important styling information to the start of the page, which helps pages display your content sooner, so your users don’t have to wait for the entire page to load. Commonly referred to as Critical CSS.',
	'jetpack-boost'
);

const deferJSContextTemplate = __(
	'Run non-essential JavaScript after the page has loaded so that styles and images can load more quickly. Read more on <link>web.dev</link>.',
	'jetpack-boost'
);
const deferJSContext = createInterpolateElement( deferJSContextTemplate, {
	// eslint-disable-next-line jsx-a11y/anchor-has-content
	link: <a href={ getRedirectUrl( 'jetpack-boost-defer-js' ) } target="_blank" rel="noreferrer" />,
} );

const imageGuideContext = __(
	'Discover and fix images with a suboptimal resolution, aspect ratio, or file size, improving user experience and page speed.',
	'jetpack-boost'
);

const supportContext = __(
	`Paid customers get dedicated email support from our world-class Happiness Engineers to help with any issue.<br><br>All other questions are handled by our team as quickly as we are able to go through the WordPress support forum.`,
	'jetpack-boost'
);

const automaticallyUpdatedContext = (
	<span>
		{ __(
			'It’s essential to regenerate Critical CSS to optimize your site speed whenever your HTML or CSS structure changes. Being on top of this can be tedious and time-consuming.',
			'jetpack-boost'
		) }
		<br />
		<br />
		{ __(
			'Boost’s cloud service can automatically detect when your site needs the Critical CSS regenerated, and perform this function behind the scenes without requiring you to monitor it manually.',
			'jetpack-boost'
		) }
	</span>
);

const imageCdnContext = __(
	`Deliver images from Jetpack's Content Delivery Network. Automatically resizes your images to an appropriate size, converts them to modern efficient formats like WebP, and serves them from a worldwide network of servers.`,
	'jetpack-boost'
);

const manuallyUpdatedContext = (
	<span>
		{ __(
			'To enhance the speed of your site, with this plan you will need to optimize CSS by using the Manual Critical CSS generation feature whenever you:',
			'jetpack-boost'
		) }
		<br />
		<br />
		<ul>
			<li>{ __( 'Make theme changes.', 'jetpack-boost' ) }</li>
			<li>{ __( 'Write a new post/page.', 'jetpack-boost' ) }</li>
			<li>{ __( 'Edit a post/page.', 'jetpack-boost' ) }</li>
			<li>
				{ __(
					'Activate, deactivate, or update plugins that impact your site layout or HTML structure.',
					'jetpack-boost'
				) }
			</li>
			<li>
				{ __(
					'Change settings of plugins that impact your site layout or HTML structure.',
					'jetpack-boost'
				) }
			</li>
			<li>
				{ __(
					'Upgrade your WordPress version if the new release includes core CSS changes.',
					'jetpack-boost'
				) }
			</li>
		</ul>
	</span>
);

const concatenateContext = __(
	'Boost your website performance by merging and compressing JavaScript and CSS files, reducing site loading time and number of requests.',
	'jetpack-boost'
);

const performanceHistoryContext = __(
	'Get access to your historical performance scores and see advanced Core Web Vitals data.',
	'jetpack-boost'
);

const isaContext = __(
	"Scan your site for images that aren't properly sized for the device they're being viewed on.",
	'jetpack-boost'
);

type BoostPricingTableProps = {
	pricing: ConfigType[ 'pricing' ];
	onPremiumCTA: () => void;
	onFreeCTA: () => void;
	chosenFreePlan: boolean;
	chosenPaidPlan: boolean;
};

export const BoostPricingTable = ( {
	onPremiumCTA,
	onFreeCTA,
	chosenFreePlan,
	chosenPaidPlan,
}: BoostPricingTableProps ) => {
	const { pricing } = useConfig();

	// If the first year discount ends, we want to show the default label.
	const legend = pricing?.isIntroductoryOffer
		? __( '/month for the first year, billed yearly', 'jetpack-boost' )
		: undefined;

	const isDiscounted = pricing?.priceBefore && pricing?.priceBefore > pricing?.priceAfter;

	return (
		<PricingTable
			title={ __( 'The easiest speed optimization plugin for WordPress', 'jetpack-boost' ) }
			items={ [
				{
					name: __( 'Optimize CSS Loading', 'jetpack-boost' ),
					tooltipInfo: cssOptimizationContext,
					tooltipPlacement: 'bottom-start',
				},
				{
					name: __( 'Image CDN', 'jetpack-boost' ),
					tooltipInfo: imageCdnContext,
					tooltipPlacement: 'bottom-start',
				},
				{
					name: __( 'Automatic image size analysis', 'jetpack-boost' ),
					tooltipInfo: isaContext,
					tooltipPlacement: 'bottom-start',
				},
				{
					name: __( 'Historical performance scores', 'jetpack-boost' ),
					tooltipInfo: performanceHistoryContext,
					tooltipPlacement: 'bottom-start',
				},
				{
					name: __( 'Defer non-essential JavaScript', 'jetpack-boost' ),
					tooltipInfo: deferJSContext,
					tooltipPlacement: 'bottom-start',
				},
				{
					name: __( 'Image guide', 'jetpack-boost' ),
					tooltipInfo: imageGuideContext,
					tooltipPlacement: 'bottom-start',
				},
				{
					name: __( 'Concatenate JS and CSS', 'jetpack-boost' ),
					tooltipInfo: concatenateContext,
					tooltipPlacement: 'bottom-start',
				},
				{
					name: __( 'Dedicated email support', 'jetpack-boost' ),
					tooltipInfo: <span dangerouslySetInnerHTML={ { __html: supportContext } }></span>,
					tooltipPlacement: 'bottom-start',
				},
			] }
		>
			<PricingTableColumn primary>
				<PricingTableHeader>
					<ProductPrice
						price={ ( pricing?.priceBefore ?? 0 ) / 12 }
						offPrice={ isDiscounted ? ( pricing?.priceAfter ?? 0 ) / 12 : undefined }
						currency={ pricing?.currencyCode }
						hideDiscountLabel={ false }
						legend={ legend }
					/>
					<Button
						onClick={ onPremiumCTA }
						isLoading={ chosenPaidPlan }
						disabled={ chosenFreePlan || chosenPaidPlan }
						fullWidth
					>
						{ __( 'Get Boost', 'jetpack-boost' ) }
					</Button>
				</PricingTableHeader>
				<PricingTableItem
					isIncluded={ true }
					label={ <strong>{ __( 'Automatically updated', 'jetpack-boost' ) }</strong> }
					tooltipTitle={ __( 'Automatic Critical CSS regeneration', 'jetpack-boost' ) }
					tooltipInfo={ automaticallyUpdatedContext }
					tooltipClassName="wide-tooltip"
				/>
				<PricingTableItem
					isIncluded={ true }
					label={ <strong>{ __( 'Included + quality settings', 'jetpack-boost' ) }</strong> }
					tooltipInfo={ __( 'Fine-tune image quality settings to your liking.', 'jetpack-boost' ) }
				/>
				<PricingTableItem isIncluded={ true } />
				<PricingTableItem isIncluded={ true } />
				<PricingTableItem isIncluded={ true } />
				<PricingTableItem isIncluded={ true } />
				<PricingTableItem isIncluded={ true } />
				<PricingTableItem isIncluded={ true } />
			</PricingTableColumn>
			<PricingTableColumn>
				<PricingTableHeader>
					<ProductPrice
						price={ 0 }
						legend=""
						currency={ pricing?.currencyCode }
						hidePriceFraction
					/>
					<Button
						onClick={ onFreeCTA }
						isLoading={ chosenFreePlan }
						disabled={ chosenFreePlan || chosenPaidPlan }
						fullWidth
						variant="secondary"
					>
						{ __( 'Start for free', 'jetpack-boost' ) }
					</Button>
				</PricingTableHeader>
				<PricingTableItem
					isIncluded={ true }
					label={ __( 'Must be done manually', 'jetpack-boost' ) }
					tooltipTitle={ __( 'Manual Critical CSS regeneration', 'jetpack-boost' ) }
					tooltipInfo={ manuallyUpdatedContext }
					tooltipClassName="wide-tooltip"
				/>
				<PricingTableItem isIncluded={ true } />
				<PricingTableItem isIncluded={ false } label={ __( 'Not included', 'jetpack-boost' ) } />
				<PricingTableItem isIncluded={ false } label={ __( 'Not included', 'jetpack-boost' ) } />
				<PricingTableItem isIncluded={ true } />
				<PricingTableItem isIncluded={ true } />
				<PricingTableItem isIncluded={ true } />
				<PricingTableItem isIncluded={ false } label={ __( 'Not included', 'jetpack-boost' ) } />
			</PricingTableColumn>
		</PricingTable>
	);
};
