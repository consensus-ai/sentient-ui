import Path from 'path'
import { getPluginName, getOrderedPlugins } from '../js/rendererjs/plugins.js'
import { expect } from 'chai'

const pluginDir = Path.join(__dirname, '../plugins')
const nPlugins = 3

describe('plugin system', () => {
	describe('getOrderedPlugins', () => {
		it('returns an array of the correct length', () => {
			expect(getOrderedPlugins(pluginDir, 'Files').size).to.equal(nPlugins)
		})
		it('has About plugin last', () => {
			expect(getPluginName(getOrderedPlugins(pluginDir, 'Files').last())).to.equal('Wallet')
		})
		it('has home plugin first', () => {
			expect(getPluginName(getOrderedPlugins(pluginDir, 'Files').first())).to.equal('About')
		})
	})
})
