import {
	PromiseSSR,
	usePromise,
	useWorkerEngine,
} from '@publicodes/worker-react'
import { ErrorBoundary } from '@sentry/react'
import { FallbackRender } from '@sentry/react/types/errorboundary'
import {
	ComponentProps,
	StrictMode,
	Suspense,
	use,
	useEffect,
	useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Route, Routes } from 'react-router-dom'
import { css, styled } from 'styled-components'

import Footer from '@/components/layout/Footer/Footer'
import Header from '@/components/layout/Header'
import { Container } from '@/design-system/layout'
import { useAxeCoreAnalysis } from '@/hooks/useAxeCoreAnalysis'
import { useGetFullURL } from '@/hooks/useGetFullURL'
import { useIsEmbedded } from '@/hooks/useIsEmbedded'
import { useSaveAndRestoreScrollPosition } from '@/hooks/useSaveAndRestoreScrollPosition'
import Landing from '@/pages/_landing/Landing'
import Page404 from '@/pages/404'
import Accessibilité from '@/pages/Accessibilité'
import Budget from '@/pages/budget/index'
import IntegrationTest from '@/pages/dev/IntegrationTest'
import Documentation from '@/pages/Documentation'
import Iframes from '@/pages/iframes'
import Integration from '@/pages/integration/index'
import Nouveautés from '@/pages/nouveautés/index'
import Offline from '@/pages/Offline'
import Plan from '@/pages/Plan'
import Simulateurs from '@/pages/simulateurs'
import SimulateursEtAssistants from '@/pages/simulateurs-et-assistants'
import Stats from '@/pages/statistiques/LazyStats'
import { useSitePaths } from '@/sitePaths'

import Provider, { ProviderProps } from './Provider'
import Redirections from './Redirections'

type RootProps = {
	basename: ProviderProps['basename']
}

const TestWorkerEngineWrapper = () => (
	<Suspense fallback={'TestWorkerEngineWrapper loading...'}>
		<TestWorkerEngine />
	</Suspense>
)

const TestWorkerEngine = () => {
	const [refresh, setRefresh] = useState(0)
	const workerEngine = useWorkerEngine()

	// const [, trigger] = useLazyPromise(
	// 	async () => workerEngine.asyncSetSituation({ SMIC: '1000€/mois' }),
	// 	[workerEngine],
	// 	{ defaultValue: 'loading...' }
	// )
	const trigger = () => workerEngine.asyncSetSituation({ SMIC: '1000€/mois' })

	const date = workerEngine.getRule('date')
	const SMIC = workerEngine.getRule('SMIC')

	// const parsedRules = useAsyncParsedRules()
	const parsedRules = workerEngine.getParsedRules()

	// const resultSmic = usePromise(
	// 	() => workerEngine.asyncEvaluate('SMIC'),
	// 	[workerEngine],
	// 	'loading...'
	// )

	const resultSmic = usePromise(
		() =>
			workerEngine.asyncEvaluate('SMIC').then((val) => {
				console.log('**************************************')

				return val
			}),
		[workerEngine]
	)
	const resultSmicx = usePromise(
		() =>
			workerEngine.asyncEvaluate('SMIC').then((val) => {
				console.log('¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤')

				return val
			}),
		[workerEngine]
	)
	console.log('#####>', resultSmic, resultSmicx)

	// const [resultLazySmic, triggerLazySmic] = useLazyPromise(
	// 	() => workerEngine.asyncEvaluate('SMIC'),
	// 	[workerEngine],
	// 	'wait 3sec...'
	// )

	useEffect(
		() => {
			void (async () => {
				await workerEngine.isWorkerReady
				setTimeout(() => {
					// void triggerLazySmic()
				}, 3000)
			})()
		},
		[
			// triggerLazySmic, workerEngine.isWorkerReady
		]
	)

	// const workerEngineCopy = useAsyncShallowCopy(workerEngine)
	// // const workerEngineCopy = workerEngine
	// console.log('=========>', workerEngine, workerEngineCopy)

	// const [, triggerCopy] = useLazyPromise(async () => {
	// 	console.log('+++++++++>', workerEngineCopy)

	// 	await workerEngineCopy?.asyncSetSituation({
	// 		SMIC: '2000€/mois',
	// 	})
	// }, [workerEngineCopy])

	// const dateCopy = useAsyncGetRule('date', {
	// 	defaultValue: 'loading...',
	// 	workerEngine: workerEngineCopy,
	// })

	// const parsedRulesCopy = useAsyncParsedRules({
	// 	workerEngine: workerEngineCopy,
	// })

	// const dateCopy = workerEngineCopy?.getRule('date')
	// const parsedRulesCopy = workerEngineCopy?.getParsedRules()

	// const resultSmicCopy = usePromise(
	// 	async () =>
	// 		!workerEngineCopy
	// 			? 'still loading...'
	// 			: workerEngineCopy.asyncEvaluate('SMIC'),
	// 	[workerEngineCopy],
	// 	'loading...'
	// )
	// const resultSmicCopy = !workerEngineCopy
	// 	? 'still loading...'
	// 	: use(workerEngineCopy.asyncEvaluate('SMIC'))

	// const [resultLazySmicCopy, triggerLazySmicCopy] = useLazyPromise(
	// 	async () =>
	// 		!workerEngineCopy
	// 			? 'still loading...'
	// 			: workerEngineCopy.asyncEvaluate('SMIC'),
	// 	[workerEngineCopy],
	// 	'wait 3sec...'
	// )

	// useEffect(
	// 	() => {
	// 		// console.log('useEffect')

	// 		void (async () => {
	// 			await workerEngine.isWorkerReady
	// 			setTimeout(() => {
	// 				// void triggerLazySmicCopy()
	// 			}, 3000)
	// 		})()
	// 	},
	// 	[
	// 		// triggerLazySmicCopy, workerEngine.isWorkerReady
	// 	]
	// )

	// const { asyncSetSituation } = workerEngineCopy ?? {}
	// usePromise(async () => {
	// 	// console.log('**************>', workerEngineCopy, resultSmic)

	// 	if (
	// 		resultSmic &&
	// 		typeof resultSmic !== 'string' &&
	// 		typeof resultSmic.nodeValue === 'number'
	// 	) {
	// 		// console.log('ooooooooooooooooooo', resultSmic)

	// 		await asyncSetSituation?.({
	// 			SMIC: resultSmic.nodeValue + '€/mois',
	// 		})
	// 	}
	// }, [asyncSetSituation, resultSmic])

	// use(
	// 	(async () => {
	// 		// console.log('**************>', workerEngineCopy, resultSmic)

	// 		if (
	// 			resultSmic &&
	// 			typeof resultSmic !== 'string' &&
	// 			typeof resultSmic.nodeValue === 'number'
	// 		) {
	// 			// console.log('ooooooooooooooooooo', resultSmic)

	// 			await asyncSetSituation?.({
	// 				SMIC: resultSmic.nodeValue + '€/mois',
	// 			})
	// 		}
	// 	})()
	// )

	return (
		<div>
			<h1>Test worker engine</h1>
			<button onClick={() => setRefresh((r) => r + 1)}>
				Refresh {refresh}
			</button>
			<button onClick={() => void trigger()}>trigger</button>
			{/* <button onClick={() => void triggerCopy()}>trigger copy</button> */}

			<p>
				date title:{' '}
				{JSON.stringify(typeof date === 'string' ? date : date?.title)}
			</p>
			<p>
				SMIC title:{' '}
				{JSON.stringify(typeof SMIC === 'string' ? SMIC : SMIC?.title)}
			</p>
			<p>
				parsedRules length:{' '}
				{JSON.stringify(Object.entries(parsedRules ?? {}).length)}
			</p>
			<p>
				resultSmic:{' '}
				{JSON.stringify(
					typeof resultSmic === 'string' ? resultSmic : resultSmic?.nodeValue
				)}
			</p>
			<p>
				resultLazySmic:{' '}
				{/* {JSON.stringify(
					typeof resultLazySmic === 'string'
						? resultLazySmic
						: resultLazySmic?.nodeValue
				)} */}
			</p>

			{/* <p>workerEngineCopy: {JSON.stringify(workerEngineCopy?.engineId)}</p> */}

			<p>
				dateCopy title:{' '}
				{/* {JSON.stringify(
					typeof dateCopy === 'string' ? dateCopy : dateCopy?.title
				)} */}
			</p>
			<p>
				parsedRulesCopy length:{' '}
				{/* {JSON.stringify(Object.entries(parsedRulesCopy ?? {}).length)} */}
			</p>
			{/* <p>
				resultSmicCopy:{' '}
				{JSON.stringify(
					typeof resultSmicCopy === 'string'
						? resultSmicCopy
						: resultSmicCopy?.nodeValue
				)}
			</p> */}
			<p>
				resultLazySmicCopy:{' '}
				{/* {JSON.stringify(
					typeof resultLazySmicCopy === 'string'
						? resultLazySmicCopy
						: resultLazySmicCopy?.nodeValue
				)} */}
			</p>
		</div>
	)
}

export default function Root({
	basename,
}: // rulesPreTransform = (r) => r,
RootProps) {
	// const situationVersion = useCreateWorkerEngine(basename)
	// const engine = useMemo(
	// 	() => engineFactory(rulesPreTransform(rules)),

	// 	// We need to keep [rules] in the dependency list for hot reload of the rules
	// 	// in dev mode, even if ESLint think it is unnecessary since `rules` isn't
	// 	// defined in the component scope.
	// 	//
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// 	[rules]
	// )

	const [promiseSSR, setPromiseSSR] = useState(false)

	const elems = (
		<Provider basename={basename}>
			<Redirections>
				<Router />
			</Redirections>
		</Provider>
	)

	return (
		<StrictMode>
			<button onClick={() => setPromiseSSR((v) => !v)}>
				use is {promiseSSR ? 'enabled' : 'disabled'}
			</button>
			{promiseSSR ? <PromiseSSR>{elems}</PromiseSSR> : elems}
		</StrictMode>
	)
}

const Router = () => {
	return (
		<>
			<Routes>
				<Route
					path="test-worker"
					element={
						<div>
							<PromiseSSR>
								<TestWorkerEngineWrapper />
								<TestWorkerEngineWrapper />
							</PromiseSSR>
						</div>
					}
				/>

				<Route path="/iframes/*" element={<Iframes />} />
				<Route path="*" element={<App />} />
			</Routes>
		</>
	)
}

const CatchOffline = ({ error }: ComponentProps<FallbackRender>) => {
	if (error.message.includes('dynamically imported module')) {
		return <Offline />
	} else {
		throw error
	}
}

const App = () => {
	const { relativeSitePaths } = useSitePaths()
	const { t } = useTranslation()
	const fullURL = useGetFullURL()
	useSaveAndRestoreScrollPosition()
	const isEmbedded = useIsEmbedded()
	const workerEngine = useWorkerEngine()
	if (!import.meta.env.PROD && import.meta.env.VITE_AXE_CORE_ENABLED) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useAxeCoreAnalysis()
	}
	const documentationPath = useSitePaths().absoluteSitePaths.documentation.index

	return (
		<StyledLayout $isEmbedded={isEmbedded}>
			{!isEmbedded && <Header />}

			<main
				role="main"
				id="main"
				style={{
					flex: '1',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<a
					href={`${fullURL}#footer`}
					aria-label={t(
						'Passer le contenu principal et aller directement au pied de page'
					)}
					className="skip-link print-hidden"
				>
					{t('Aller directement au pied de page')}
				</a>
				<Container>
					<ErrorBoundary fallback={CatchOffline}>
						<Suspense>
							<Routes>
								<Route index element={<Landing />} />

								{/* <Route
								path={relativeSitePaths.assistants.index + '/*'}
								element={<Assistants />}
							/> */}
								<Route
									path={relativeSitePaths.simulateurs.index + '/*'}
									element={<Simulateurs />}
								/>
								<Route
									path={relativeSitePaths.simulateursEtAssistants + '/*'}
									element={<SimulateursEtAssistants />}
								/>
								<Route
									path={relativeSitePaths.documentation.index + '/*'}
									element={
										<Documentation
											documentationPath={documentationPath}
											engine={workerEngine}
										/>
									}
								/>
								<Route
									path={relativeSitePaths.développeur.index + '/*'}
									element={<Integration />}
								/>
								<Route
									path={relativeSitePaths.nouveautés.index + '/*'}
									element={<Nouveautés />}
								/>
								<Route path={relativeSitePaths.stats} element={<Stats />} />
								<Route path={relativeSitePaths.budget} element={<Budget />} />
								<Route
									path={relativeSitePaths.accessibilité}
									element={<Accessibilité />}
								/>
								<Route
									path="/dev/integration-test"
									element={<IntegrationTest />}
								/>
								<Route path={relativeSitePaths.plan} element={<Plan />} />

								<Route path="*" element={<Page404 />} />
							</Routes>
						</Suspense>
					</ErrorBoundary>
				</Container>
			</main>
			{!isEmbedded && <Footer />}
		</StyledLayout>
	)
}

const StyledLayout = styled.div<{
	$isEmbedded: boolean
}>`
	${({ $isEmbedded }) =>
		!$isEmbedded &&
		css`
			flex-direction: column;
			display: flex;
			height: 100%;
		`}

	min-height: 100vh;
`
