
export default function ContactPage({ params }: { params: { locale: string } }) {
  const { locale } = params

  return (
    <main>
      <h1>{locale === 'uk' ? 'Контакти' : 'Contact'}</h1>
      <p>{locale === 'uk' ? 'Зв' + 'язатися з нами можна тут.' : 'You can reach us here.'}</p>
    </main>
  )
}
