import { useDetails } from 'src/providers'

export const PreviewSvg = () => {
  const { state } = useDetails()

  return (
    <div
      className="flex h-full items-center justify-center p-8"
      dangerouslySetInnerHTML={{ __html: state.currentString }}
    ></div>
  )
}
