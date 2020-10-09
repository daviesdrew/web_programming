import React from 'react';
import './index.css';
import about_image from '../media/about_image.png';
import logo from '../media/university_logo.png';

function About() {
	return (
		<div className='about-container'>
			<div className='about-container--left'>
				<div className='about-header--left'>
					Codices Manuscripti | Apocryphorum | Novi Testamenti
				</div>
				<div className='about-image--left'>
					<img src={about_image} alt='About'/>
				</div>
				<div className='about-footer--left'>
					Tractatus secundum Nichodemum, London, British Library, MS Royal 1 E. IX, forl. 282rb
				</div>
			</div>
			<div className='about-container--right'>
				<div className='about-header--right'>
					Manuscripts of New Testament | Apocrypha
				</div>
				<div className='about-description--right-top'>
					Ancient and medieval apocrypha relating to the New Testament
					survive in thousands of manuscripts scattered in libraries
					around the world. The goal of this project is to identify those
					manuscripts, gather their descriptions in a single research
					archive, and provide tools for their exploration and analysis.
				</div>
				<div className='about-construction-stage--right'>
					Construction Stage 1
				</div>
				<div className='about-title--right'>
					An Online Census of Manuscripts Containing Pilate Apocrypha
				</div>
				<div className='about-description--right-bottom'>
					At this stage, the project aims to update, expand, and make
					accessible online Z. Izydorczyk, Manuscripts of the Evangelium
					Nicodemi: A Census (1993). The <b>Online Census</b> will include
					manuscripts of all Pilate apocrypha in all ancient and medieval
					languages; it will also identify all other apocryphal texts that
					occur in the same manuscripts.
				</div>
				<div className='about-footer--right'>
					<div className='about-footer--right-text'>
						Zbigniew Izydorczyk<br />
						University of Winnipeg
				</div>
					<img className='about-footer--right-logo' src={logo} alt='Logo'/>
				</div>
			</div>
		</div>
	);
}

export default About;