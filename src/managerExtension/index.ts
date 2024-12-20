import type { Browser } from 'puppeteer'

interface defineExtension {
	url: string
	title: string
}
export default class ManagerExtension {
	private url: string
	private title: string
	argumentsBrowser: string[]
	constructor({ url, title }: defineExtension) {
		this.url = url
		this.title = title
		this.argumentsBrowser = [
			`--disable-extensions-except=${this.url}`,
			`--load-extension=${this.url}`,
		]
	}
	async make(browser: Browser) {
		browser.on('targetcreated', async (target) => {
			if (target.type() === 'page') {
				const page = await target.page()
				try {
					await page.waitForNavigation({ waitUntil: 'domcontentloaded' })
				} catch {}
				if ((await page.title()).includes(this.title)) await page.close()
			}
		})
		return this
	}
}
