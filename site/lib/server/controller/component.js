import {
  Controller,
  Get,
  QueryParams,
  OutputJson,
  OutputJavascript,
} from '../decorator';
import {
  deleteReleaseZip,
  getVersions,
  getFileAuthors,
  getComponent,
  getCss,
  getNavGroups,
  getReleaseZipPath,
} from '../service/component';

@Controller('/api')
export default class ComponentController {
  @OutputJson()
  @Get('/versions')
  getVersions() {
    return getVersions();
  }

  @OutputJson()
  @Get('/authors')
  getAuthors(
    @QueryParams({ name: 'name' }) name,
    @QueryParams({ name: 'type' }) type,
  ) {
    let filePath

    if (type === 'component') {
      filePath = 'packages/' + name;
    } else {
      filePath = 'packages/directives/src/' + name + '.ts';
    }
    return getFileAuthors(filePath);
  }

  @OutputJavascript()
  @Get('/component')
  async getComponent(
    @QueryParams({ name: 'version' }) version,
    @QueryParams({ name: 'component' }) component,
    @QueryParams({ name: 'type' }) type,
  ) {
    const releaseZipPath = await getReleaseZipPath(version);
    return getComponent(releaseZipPath, component, version, type);
  }

  @OutputJson()
  @Get('/css')
  async getCss(
    @QueryParams({ name: 'version' }) version,
    @QueryParams({ name: 'component' }) component,
    @QueryParams({ name: 'type' }) type,
  ) {
    const releaseZipPath = await getReleaseZipPath(version);
    return getCss(releaseZipPath, component, version, type);
  }

  @OutputJson()
  @Get('/nav/groups')
  async getNavGroups(
    @QueryParams({ name: 'version' }) version,
  ) {
    const releaseZipPath = await getReleaseZipPath(version);
    return getNavGroups(releaseZipPath);
  }

  @OutputJson()
  @Get('/release/delete')
  deleteRelease(
    @QueryParams({ name: 'version' }) version,
  ) {
    return deleteReleaseZip(version);
  }
}
