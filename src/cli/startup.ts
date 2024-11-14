import commands from '@/commands'
import config from '@/configs/config'
import ManagerExtension from '@/managerExtension'
import scrapYoutube from '@/scrapYoutube'
import dotenv from 'dotenv'
import puppeteer from 'puppeteer'
import scrapDiscord from '../scrapDiscord'
dotenv.config()
export default async function startup({ console_log, trowError }) {
	// SECTION :Setup ---------------------------------------------
	await config.all.load()
	const allPatch = config.all.patch()
	const configSystem = config.system.properties()
	const configChannel = config.channel.properties()
	const argumentsBrowser = config.browser.properties()
	// SECTION :Data ---------------------------------------------
	const credencial = process.env
	const nameServer = 'Programadores y Estudiantes | Comunidad de Programación'
	const nameChannel = "Tsure's Channel"
	const inputDevice = 'VB-Audio Virtual Cable'
	const extension = 'C:\\Users\\danie\\Documents\\AdGuard'
	const dirUserData = 'C:\\Users\\danie\\Documents\\CHROMIUN'
	argumentsBrowser.headless = false
	// SECTION :Init ---------------------------------------------
	const configExtension = {
		url: extension,
		title: 'AdGuard',
	}
	const managerExtension = new ManagerExtension(configExtension)
	const browser = await puppeteer.launch({
		headless: false,
		devtools: false,
		userDataDir: dirUserData,
		args: [
			'--no-sandbox',
			'--disable-setuid-sandbox',
			...managerExtension.argumentsBrowser,
		],
		ignoreDefaultArgs: ['--enable-automation'],
	})
	await managerExtension.make(browser)
	// SECTION :Run ---------------------------------------------
	const youtube = await new scrapYoutube().make(browser)
	const discord = await new scrapDiscord().make(browser)
	const onLogin = await discord.user.login(credencial)
	console.log('login [', onLogin, ']', discord.page.url())
	// SECTION :Config user ---------------------------------------------
	if (!onLogin) {
		const confUser = discord.user.config
		await confUser.open(async () => {
			console.log('config open', discord.page.url())
			await confUser.voiceAndVideo.inputVolume.set(50)
			console.log('[config] inputVolume')
			await confUser.voiceAndVideo.outputVolume.set(0)
			console.log('[config] outputVolume')
			await confUser.voiceAndVideo.input.setDevice(inputDevice)
			console.log('[config] input')
			await confUser.voiceAndVideo.sensibility.set(0)
			console.log('[config] sensibility')
			await confUser.voiceAndVideo.alwaysVideo.disable()
			console.log('[config] alwaysVideo')
			await confUser.voiceAndVideo.echoCancellation.disable()
			console.log('[config] echoCancellation')
			await confUser.voiceAndVideo.hardwareAcceleration.disable()
			console.log('[config] hardwareAcceleration')
			await confUser.voiceAndVideo.automaticGain.disable()
			console.log('[config] automaticGain')
			await confUser.voiceAndVideo.streamPreviews.disable()
			console.log('[config] streamPreviews')
			await confUser.voiceAndVideo.noiseSuppression.nothing()
			console.log('[config] noiseSuppression')
		})
		console.log('config', discord.page.url())
	}
	// SECTION :Select ----------------------------------------------------
	await discord.server.select(nameServer)
	console.log('server', discord.page.url())
	const connected = await discord.channel.connect(nameChannel)
	console.log('channel [', connected, ']', discord.page.url())
	if (connected) return
	// SECTION :Chat ------------------------------------------------------
	await discord.chat.microphone.unMute()
	console.log('microphone unmute')
	await discord.chat.open(async (actions) => {
		console.log('chat ready')
		actions.listen((data) => commands(data, actions, youtube))
	})
	// SECTION :End ------------------------------------------------------
	await discord.channel.disconnect()
	console.log('disconnect', discord.page.url())
	await discord.close()
	console.log('close', discord.page.url())
	browser.close()
	console.log('close browser')
	return false
}
