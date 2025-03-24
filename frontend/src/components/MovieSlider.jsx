import React, { useEffect, useRef, useState } from 'react'

import axios from 'axios';
import { Link } from 'react-router-dom';
import { SMALL_IMG_BASE_URL } from '../utils/constants';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useContentStore } from '../store/content';

const MovieSlider = ({category}) => {
    const {contentType} = useContentStore();
    const [content, setContent] = useState([])
    const [showArrow, setShowArrow] = useState(false)

   const sliderRef = useRef(null)


    const formattedCategoryName =
		category.replaceAll("_", " ")[0].toUpperCase() + category.replaceAll("_", " ").slice(1);
	const formattedContentType = contentType === "movie" ? "Movies" : "TV Shows";

    useEffect(() => {
		const getContent = async () => {
			const res = await axios.get(`/api/v1/${contentType}/${category}`);
            const filteredContent = res.data.content.filter(item => item.poster_path !== null && item.backdrop_path !== null);
			setContent(filteredContent);
		};

		getContent();
	}, [contentType, category]);
    
    const scrollLeft = () => {
        if (sliderRef.current){
            sliderRef.current.scrollBy({left:-sliderRef.current.offsetWidth, behavior: "smooth"})
        }
    }
    const scrollRight = () => {
        if (sliderRef.current){
            sliderRef.current.scrollBy({left:sliderRef.current.offsetWidth, behavior: "smooth"})
        }
    }
    
    

  return (
    <div className='text-white bg-black relative px-5 md:px-20'
        onMouseEnter={() => setShowArrow(true)}
        onMouseLeave={() => setShowArrow(false)}
    >
        <h2 className='mb-4 text-2xl font-bold'>
            {formattedCategoryName} {formattedContentType}
        </h2>
     
        <div className='flex space-x-4 overflow-x-scroll no-scrollbar' ref={sliderRef} >
            {content?.map((item) => (
                <Link to={`/watch/${item.id}`} className='min-w-[250px] relative group' key={item.id}>
                    <div className='rounded-lg overflow-hidden'>
                        <img src={SMALL_IMG_BASE_URL + item?.poster_path} alt='Movie Poster' className='transition-transform duration-300 ease-in-out group-hover:scale-125 w-[250px] h-[375px]'/>
                    </div>
                    <p className='mt-2 text-center'>{item.title || item.name}</p>
                </Link>
            ))}
        </div>
        {showArrow && (
            <>
                <button className='absolute top-1/2 -translate-y-1/2 left-5 md:left-24 flex items-center justify-center size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10'>
                    <ChevronLeft size={24} onClick={scrollLeft}/>
                </button>

                <button className='absolute top-1/2 -translate-y-1/2 right-5 md:right-24 flex items-center justify-center size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10'>
                    <ChevronRight size={24} onClick={scrollRight} />
                </button>
            </>
        )}
    </div>
  )
}

export default MovieSlider