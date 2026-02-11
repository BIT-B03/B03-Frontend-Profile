import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { getProjectPreviewImageUrl } from '../../../api/api';

const PreviewGallery = ({ previews = [], title, description, showTitleAndDescription = false }) => {
    if (!previews || previews.length === 0) return null;

    return (
        <>
            {/* Carousel Card */}
            <div className="bg-brand-fill border border-brand-stroke rounded-3xl p-0 shadow-2xl mb-6">
                {/* Swiper Container */}
                <div className="relative overflow-hidden">
                    <Swiper
                        modules={[Autoplay]}
                        grabCursor={true}
                        centeredSlides={true}
                        slidesPerView={1}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        className="w-full"
                    >
                        {previews.map((preview, idx) => {
                            const url = getProjectPreviewImageUrl(preview?.filename || preview?.preview);
                            return (
                                <SwiperSlide key={idx}>
                                    {url ? (
                                        <img
                                            src={url}
                                            alt={`Preview ${idx + 1}`}
                                            className="rounded-2xl w-full h-[230px] sm:h-[450px] md:h-[500px] object-contain"
                                        />
                                    ) : (
                                        <div className="rounded-2xl overflow-hidden w-full h-[230px] sm:h-[450px] md:h-[500px] flex items-center justify-center bg-brand-fill/30">
                                            <svg className="w-16 h-16 text-pure-white opacity-50" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                                            </svg>
                                        </div>
                                    )}
                                </SwiperSlide>
                            );
                        })}

                    </Swiper>
                </div>
            </div>

            {/* Title & Description Card (separate) */}
            {showTitleAndDescription && (title || description) && (
                <div className="bg-brand-fill border border-brand-stroke rounded-3xl p-6 md:p-8 shadow-2xl">
                    {title && (
                        <h2 className="text-2xl md:text-3xl font-bold text-pure-white font-inter mb-4">
                            {title}
                        </h2>
                    )}

                    {description && (
                        <div className="text-pure-white/90 text-sm md:text-base leading-relaxed">
                            {description}
                        </div>
                    )}
                </div>
            )}

            {/* Swiper Pagination Styling */}
            <style>{`
                .swiper {
                    width: 100%;
                    height: 100%;
                }

                .swiper-wrapper {
                    display: flex;
                    flex-direction: row;
                }

                .swiper-slide {
                    width: 100%;
                    height: auto;
                    display: flex;
                    flex-shrink: 0;
                }

                .swiper-pagination-custom .swiper-pagination-bullet {
                    background: rgba(255, 255, 255, 0.4);
                    opacity: 1;
                    width: 8px;
                    height: 8px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }

                .swiper-pagination-custom .swiper-pagination-bullet-active {
                    background: #60a5fa;
                }
            `}</style>
        </>
    );
};

export default PreviewGallery;
