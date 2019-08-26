import defaultSettings from '@/settings'

const title = defaultSettings.title || '华韵亿美'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
