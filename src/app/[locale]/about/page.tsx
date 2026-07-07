
export default function AboutPage({ params }: { params: { locale: string } }) {
  const { locale } = params

  return (
    <main>
      <h1>{locale === 'uk' ? 'Про нас' : 'About'}</h1>
      <p>{locale === 'uk' ? 'Це сторінка про наш магазин.' : 'This is the about page for our shop.'}</p>
    </main>
  )
}
