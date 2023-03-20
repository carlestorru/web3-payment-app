import Particles from 'react-particles';
import { WalletConnector } from '../../components/WalletConnector';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { useCallback } from 'react';
import { loadFull } from 'tsparticles';

import './Landing.css';

const Landing = () => {
	useDocumentTitle('Landing');

	const particlesInit = useCallback(async (engine) => {
		// console.log(engine);
		// you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
		// this loads the tsparticles package bundle, it's the easiest method for getting everything ready
		// starting from v2 you can add only the features you need reducing the bundle size
		await loadFull(engine);
	}, []);

	const particlesLoaded = useCallback(async (container) => {
		// await console.log(container);
	}, []);

	return (
		<>
			<main className='flex h-screen w-full flex-col justify-evenly bg-blue-600 p-5 text-center text-white'>
				<Particles
					id='tsparticles'
					init={particlesInit}
					loaded={particlesLoaded}
					options={{
						particles: {
							number: {
								value: 80,
								density: {
									enable: true,
									value_area: 800,
								},
							},
							color: {
								value: '#ffffff',
							},
							shape: {
								type: 'circle',
								stroke: {
									width: 0,
									color: '#000000',
								},
								polygon: {
									nb_sides: 5,
								},
							},
							opacity: {
								value: 0.5,
								random: false,
								anim: {
									enable: false,
									speed: 1,
									opacity_min: 0.1,
									sync: false,
								},
							},
							size: {
								value: 3,
								random: true,
								anim: {
									enable: false,
									speed: 40,
									size_min: 0.1,
									sync: false,
								},
							},
							line_linked: {
								enable: true,
								distance: 150,
								color: '#ffffff',
								opacity: 0.4,
								width: 1,
							},
							move: {
								enable: true,
								speed: 6,
								direction: 'none',
								random: false,
								straight: false,
								out_mode: 'out',
								bounce: false,
								attract: {
									enable: false,
									rotateX: 600,
									rotateY: 1200,
								},
							},
						},
						interactivity: {
							detect_on: 'canvas',
							events: {
								onhover: {
									enable: false,
									mode: 'repulse',
								},
								onclick: {
									enable: false,
									mode: 'push',
								},
								resize: true,
							},
							modes: {
								grab: {
									distance: 400,
									line_linked: {
										opacity: 1,
									},
								},
								bubble: {
									distance: 400,
									size: 40,
									duration: 2,
									opacity: 8,
									speed: 3,
								},
								repulse: {
									distance: 200,
									duration: 0.4,
								},
								push: {
									particles_nb: 4,
								},
								remove: {
									particles_nb: 2,
								},
							},
						},
						retina_detect: true,
					}}
				/>

				<h1 className='w-[80%] self-center rounded-lg bg-white py-3 text-7xl font-bold text-blue-500'>
					3Pay
				</h1>
				<section className='z-10 flex flex-row items-center justify-evenly'>
					<article className='flex w-[25%] flex-col'>
						<h2 className='mb-6 text-left text-2xl font-medium'>
							Paga tus compras en Ecommerce, envia dinero a tus contactos, emite
							facturas, consulta tu historial de transaciones y mucho más de
							forma{' '}
							<span className='bg-gradient-to-br from-blue-100 to-blue-300 bg-clip-text text-transparent'>
								descentralizada
							</span>
						</h2>
						<div className='self-start'>
							<WalletConnector />
						</div>
					</article>
					<article className='landing-image w-[40%] bg-white'>
						<img
							src='https://cdn.dribbble.com/users/2886970/screenshots/15990765/downloads/light%20dasj.png'
							alt='dashboard'
							width='450'
							height='550'
						/>
					</article>
				</section>
			</main>
		</>
	);
};

export default Landing;
