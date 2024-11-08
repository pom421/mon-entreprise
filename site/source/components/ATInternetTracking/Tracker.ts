/* eslint-disable no-console */
import * as pa from './piano-analytics.js'

// Ci-dessous les indicateurs personnalisés de site et de page
// https://developers.atinternet-solutions.com/as2-tagging-fr/javascript-fr/contenus-javascript-fr/indicateurs-de-site-et-de-page-javascript-fr/index.html
export const INDICATOR = {
	SITE: {
		LANGAGE: 1,
		EMBARQUÉ: 2,
	},
	PAGE: {},
} as const

type PageHit = {
	page?: string
	page_chapter1?: string
	page_chapter2?: string
	page_chapter3?: string
}

type ClickHit = {
	click?: string
	click_chapter1?: string
	click_chapter2?: string
	click_chapter3?: string
	evenement_type?: 'telechargement'
}

export interface ATTracker {
	setProperties(
		propertiesObject: {
			env_language: 'fr' | 'en'
			'n:simulateur_embarque': 1 | 0
		},
		options: {
			persistent: true
		}
	): void

	sendEvent(type: 'page.display', data: PageHit): void
	sendEvent(
		type:
			| 'demarche.document'
			| 'click.action'
			| 'click.navigation'
			| 'click.download'
			| 'click.exit',
		data: ClickHit & PageHit
	): void

	consent: {
		setMode(type: 'exempt' | 'optout'): void
		getMode(): { name: 'exempt' | 'optout' }
	}
}

type ATTrackerClass = { new (options: { site: number }): ATTracker }

export const pianoAnalytics = pa as ATTrackerClass

export function createTracker(siteId?: string, doNotTrack = false) {
	const site = siteId ? +siteId : 0

	if (Number.isNaN(site)) {
		throw new Error('expect string siteId to be of number form')
	}

	const BaseTracker: ATTrackerClass =
		siteId && !import.meta.env.SSR ? pianoAnalytics : Log

	class Tag extends BaseTracker implements ATTracker {
		#sendEvent: ATTracker['sendEvent']

		constructor(options: { language: 'fr' | 'en' }) {
			super({ site })
			this.#sendEvent = this.sendEvent.bind(this)
			this.sendEvent = (type, data) => {
				if (type === 'page.display') {
					this.#currentPageInfo = data
					this.#sendEvent(type, data)

					return
				}
				if (!('click' in data)) {
					throw new Error('invalid argument error')
				}
				this.#sendEvent(type, { ...this.#currentPageInfo, ...data })
			}

			this.setProperties(
				{
					env_language: options.language,
					'n:simulateur_embarque': document.location.pathname.includes(
						'/iframes/'
					)
						? 1
						: 0,
				},
				{
					persistent: true,
				}
			)

			if (import.meta.env.MODE === 'production' && doNotTrack) {
				this.consent.setMode('optout')
			} else {
				this.consent.setMode('exempt')
			}
		}

		#currentPageInfo: PageHit = {}
	}

	return Tag
}

export class Log implements ATTracker {
	constructor(options?: Record<string, string | number>) {
		console.debug('ATTracker::new', options)
	}

	setProperties(
		propertiesObject: {
			env_language: string
			'n:simulateur_embarque': number
		},
		options: {
			persistent: true
		}
	) {
		console.debug('ATTracker::setProperties', {
			...propertiesObject,
			persistent: options.persistent,
		})
	}

	sendEvent(name: string, data: Record<string, unknown>): void {
		console.debug('ATTracker::sendEvent', name, data)
	}

	consent: ATTracker['consent'] = {
		setMode(...args) {
			console.debug('ATTracker::consent.setMode', ...args)
		},
		getMode() {
			console.debug('ATTracker::consent.getMode')

			return { name: 'exempt' }
		},
	}
}
