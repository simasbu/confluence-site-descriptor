import * as core from '@actions/core'
import * as builder from './buildSiteDescriptor'
import * as fs from 'fs'
import * as verify from './verify'
import {SiteDescriptor} from './SiteDescriptor'

async function run(): Promise<void> {
  try {
    const localDirectory = core.getInput('localDirectory', {required: true})
    const parentPageTitle = core.getInput('parentPageTitle', {required: true})
    const homePageTitle = core.getInput('homePageTitle', {required: true})
    const spaceKey = core.getInput('spaceKey', {required: true})

    verify.verifySpaces(localDirectory)

    const folderTree = builder.buildFolderTree(localDirectory)
    folderTree.name = homePageTitle

    let siteDescriptor: SiteDescriptor = {
      uri: 'README.md',
      parentPageTitle,
      name: builder.replaceUnderscore(homePageTitle)
    }
    siteDescriptor = builder.buildSiteNode(folderTree, siteDescriptor)
    fs.writeFileSync(
      'site.yaml',
      JSON.stringify({spaceKey, home: siteDescriptor})
    )
  } catch (error) {
    core.setFailed(error.message)
  }
}
run()
