import React from 'react'

export default function HeroSection() {
    return (
        <section className="flex flex-col md:flex-row md:justify-around items-center gap-5 px-2 py-8">
            <div className="text-center">
                <h1 className="text-lg md:text-xl font-extrabold text-black leading-6 md:leading-10">My Brainstorming Sessions</h1>
                <p className=" text-sm text-gray-500 leading-4">Create or join Brainstorming Sessions</p>
            </div>

            <button className="btn  btn-primary btn-sm md:btn-md lg:btn-lg">
                + New session
            </button>
        </section>
    )
}

