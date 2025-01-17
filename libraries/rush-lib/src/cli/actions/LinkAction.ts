// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { CommandLineFlagParameter } from '@rushstack/ts-command-line';

import { RushCommandLineParser } from '../RushCommandLineParser';

import { BaseLinkManager } from '../../logic/base/BaseLinkManager';
import { BaseRushAction } from './BaseRushAction';

export class LinkAction extends BaseRushAction {
  private readonly _force: CommandLineFlagParameter;

  public constructor(parser: RushCommandLineParser) {
    super({
      actionName: 'link',
      summary: 'Create node_modules symlinks for all projects',
      documentation:
        'Create node_modules symlinks for all projects.  This operation is normally performed' +
        ' automatically as part of "rush install" or "rush update".  You should only need to use "rush link"' +
        ' if you performed "rush unlink" for some reason, or if you specified the "--no-link" option' +
        ' for "rush install" or "rush update".',
      parser
    });

    this._force = this.defineFlagParameter({
      parameterLongName: '--force',
      parameterShortName: '-f',
      description:
        'Deletes and recreates all links, even if the filesystem state seems to indicate that this is ' +
        'unnecessary.'
    });
  }

  protected async runAsync(): Promise<void> {
    const linkManagerFactoryModule: typeof import('../../logic/LinkManagerFactory') = await import(
      '../../logic/LinkManagerFactory'
    );
    const linkManager: BaseLinkManager = linkManagerFactoryModule.LinkManagerFactory.getLinkManager(
      this.rushConfiguration
    );
    await linkManager.createSymlinksForProjects(this._force.value);
  }
}
