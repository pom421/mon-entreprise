import PageFeedback from '@/components/Feedback'
import LegalNotice from '@/components/LegalNotice'
import Emoji from '@/components/utils/Emoji'
import { SitePathsContext } from '@/components/utils/SitePathsContext'
import { FooterContainer } from '@/design-system/footer'
import { FooterColumn } from '@/design-system/footer/column'
import { Container } from '@/design-system/layout'
import { Link } from '@/design-system/typography/link'
import { Body } from '@/design-system/typography/paragraphs'
import { useContext } from 'react'
import { Helmet } from 'react-helmet-async'
import { Trans, useTranslation } from 'react-i18next'
import { ThemeProvider } from 'styled-components'
import { hrefLangLink } from '@/sitePaths'
import InscriptionBetaTesteur from './InscriptionBetaTesteur'
import Privacy from './Privacy'
import { useShowFeedback } from './useShowFeedback'

export default function Footer() {
	const sitePaths = useContext(SitePathsContext)
	const showFeedback = useShowFeedback()
	const language = useTranslation().i18n.language as 'fr' | 'en'

	const currentEnv = import.meta.env.MODE
	const encodedUri =
		typeof window !== 'undefined' &&
		(currentEnv === 'production' || currentEnv === 'development'
			? `${window.location.protocol}//${window.location.host}`
			: '') + window.location.pathname
	const uri = decodeURIComponent(encodedUri || '').replace(/\/$/, '')
	const hrefLink = hrefLangLink[language][uri] || []

	return (
		<>
			<Helmet>
				{hrefLink.map(({ href, hrefLang }) => (
					<link
						key={hrefLang}
						rel="alternate"
						hrefLang={hrefLang}
						href={href}
					/>
				))}
			</Helmet>
			<div
				css={`
					flex: 1;
				`}
			/>
			<footer>
				<Container
					backgroundColor={(theme) => theme.colors.bases.tertiary[100]}
				>
					{showFeedback && <PageFeedback />}
					{language === 'en' && (
						<Body>
							This website is provided by the{' '}
							<Link href="https://www.urssaf.fr">Urssaf</Link>, the French
							social security contributions collector.
						</Body>
					)}
				</Container>

				<Container backgroundColor={(theme) => theme.colors.bases.primary[700]}>
					<ThemeProvider theme={(theme) => ({ ...theme, darkMode: true })}>
						<FooterContainer className="print-hidden">
							<FooterColumn>
								{language === 'fr' && (
									<ul>
										<li>
											<Link to={sitePaths.nouveautés}>
												Nouveautés <Emoji emoji="✨" />
											</Link>
										</li>
										<li>
											<Link to={sitePaths.stats}>
												Stats <Emoji emoji="📊" />
											</Link>
										</li>
										<li>
											<Link to={sitePaths.budget}>
												Budget <Emoji emoji="💶" />
											</Link>
										</li>
									</ul>
								)}
							</FooterColumn>
							<FooterColumn>
								<ul>
									<li>
										<Link to={sitePaths.integration.index}>
											<Trans>Intégrer nos simulateurs</Trans>
										</Link>
									</li>
									{language === 'fr' && (
										<li>
											<InscriptionBetaTesteur />
										</li>
									)}
									{hrefLink.map(({ hrefLang, href }) => (
										<li key={hrefLang}>
											<Link href={href} openInSameWindow>
												{hrefLang === 'fr' ? (
													<>
														Passer en français <Emoji emoji="🇫🇷" />
													</>
												) : hrefLang === 'en' ? (
													<>
														Switch to English <Emoji emoji="🇬🇧" />
													</>
												) : (
													hrefLang
												)}
											</Link>
										</li>
									))}
								</ul>
							</FooterColumn>

							<FooterColumn>
								<ul>
									<li>
										<LegalNotice />
									</li>
									<li>
										<Privacy />
									</li>
									{language === 'fr' && (
										<li>
											<Link to={sitePaths.accessibilité}>
												<Trans i18nKey="footer.accessibilité">
													Accessibilité : non conforme
												</Trans>
											</Link>
										</li>
									)}
								</ul>
							</FooterColumn>
						</FooterContainer>
					</ThemeProvider>
				</Container>
			</footer>
		</>
	)
}
