// app/about/page.tsx
"use client"
import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const About: FC = () => {
	return (
		<main className="about-page">
			<section className="about-content">
				<h1>Changelog</h1>
				<div className="profile">
					<Image
						src="/next.svg" // Замените на путь к вашему изображению
						alt="Profile Picture"
						width={150}
						height={150}
						className="profile-image"
					/>
					<h2>01.09.2024</h2>

					<Link href="https://github.com/gareevart/figma-app/commit/6a2f449ac3dded69542ecd5fa5e78f18868b50f2">
						[6a2f449]
					</Link>
					<p>
						Перенос структуры приложения на NodeJS и подключение Nextjs 14
					</p>
				</div>
			</section>
			<style jsx>{`
        .about-page {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }

        .about-content {
          text-align: center;
        }

        .profile {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .profile-image {
          border-radius: 50%;
          margin-bottom: 20px;
        }

        .social-links {
          list-style-type: none;
          padding: 0;
        }

        .social-links li {
          margin: 10px 0;
        }

        .social-links a {
          color: #0070f3;
          text-decoration: none;
        }

        .social-links a:hover {
          text-decoration: underline;
        }
      `}</style>
		</main>
	);
};

export default About;