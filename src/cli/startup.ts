import config from '@/configs/config'
import dotenv from 'dotenv'
import puppeteer from 'puppeteer'
import discord from '../discord'
dotenv.config()
export default async function startup({ console_log, trowError }) {
	// SECTION :Setup ---------------------------------------------
	const credencial = process.env
	await config.all.load()
	const allPatch = config.all.patch()
	const argumentsBrowser = config.browser.properties()
	const configSystem = config.system.properties()
	const configChannel = config.channel.properties()
	argumentsBrowser.headless = false
	// biome-ignore lint/performance/noDelete: <explanation>
	delete argumentsBrowser.userDataDir
	// SECTION :Init ---------------------------------------------
	const browser = await puppeteer.launch(argumentsBrowser)

	const musicPage = await browser.newPage()
	const discordPage = await browser.newPage()

	// SECTION :Run ---------------------------------------------
	await discord.login(discordPage, credencial)

	return false
}
