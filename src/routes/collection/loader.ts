import _ from 'lodash'
import { LoaderFunctionArgs, defer } from 'react-router-dom'
import svgFactory from 'scripts/svg-factory'
import { initCollectionState } from 'src/providers'
import type { PageData } from 'src/types'
import { StorageUtils } from 'src/utils/storage-utils'
import { svgFactoryChecker } from 'src/utils/svg-factory-checker'

export async function collectionLoader({ params }: LoaderFunctionArgs) {
  const pageData = await StorageUtils.getPageData<PageData>(params.id as string)
  let { view } = await chrome.storage.local.get('view')

  // Initialize context states if not exist in DB using lodash
  view = _.assign({}, initCollectionState.view, view)

  // Dev logger to look for malformed svgs
  svgFactoryChecker(pageData)

  return defer({
    view,
    collectionId: params.id,
    data: svgFactory.process(pageData), // Returns [] if no data
  })
}
