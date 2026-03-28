import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, Pagination, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import { getProjectPreviewImageUrl } from '../../../api/api';

const PreviewGallery = ({ previews = [], title, description, showTitleAndDescription = false, creator = null }) => {
    const navigate = useNavigate();
    const [thumbsSwiper, setThumbsSwiper] = React.useState(null);

    if (!previews || previews.length === 0) return null;

    return (
        <>
            {/* Carousel Card */}
            <div className="bg-brand-fill border border-brand-stroke rounded-3xl p-3 sm:p-4 shadow-2xl mb-6 w-full">
                {/* Swiper Container */}
                <div className="relative overflow-hidden rounded-3xl">
                    <Swiper
                        modules={[Autoplay, Pagination, Thumbs]}
                        grabCursor={true}
                        centeredSlides={true}
                        slidesPerView={1}
                        loop={previews.length > 1}
                        pagination={{ clickable: true }}
                        thumbs={{
                            swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
                        }}
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
                                    <div className="relative w-full aspect-video bg-brand-fill/30">
                                        {url ? (
                                            <img
                                                src={url}
                                                alt={`Preview ${idx + 1}`}
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <svg className="w-16 h-16 text-pure-white opacity-50" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                                                </svg>
                                            </div>
                                        )}

                                        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
                                    </div>
                                </SwiperSlide>
                            );
                        })}

                    </Swiper>
                </div>

                {/* Thumbnail Swiper */}
                {previews.length > 1 && (
                    <div className="mt-4">
                        <Swiper
                            modules={[FreeMode, Thumbs]}
                            onSwiper={setThumbsSwiper}
                            spaceBetween={12}
                            slidesPerView="auto"
                            freeMode={true}
                            watchSlidesProgress={true}
                            className="w-full"
                        >
                            {previews.map((preview, idx) => {
                                const url = getProjectPreviewImageUrl(preview?.filename || preview?.preview);
                                return (
                                    <SwiperSlide key={`thumb-${idx}`} className="!w-24 sm:!w-32 lg:!w-36">
                                        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-transparent">
                                            {url ? (
                                                <img
                                                    src={url}
                                                    alt={`Thumbnail ${idx + 1}`}
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center bg-brand-fill/30">
                                                    <svg className="w-8 h-8 text-pure-white opacity-50" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </div>
                )}
            </div>

            {/* Title & Description Card (separate) */}
            {showTitleAndDescription && (title || description) && (
                <div className="bg-brand-fill border border-brand-stroke rounded-3xl p-6 md:p-8 shadow-2xl">
                    {title && (
                        <>
                            <h2 className="text-2xl md:text-3xl font-bold text-pure-white font-inter mb-2">
                                {title}
                            </h2>

                            {/* Created by line - placed directly under title */}
                            {creator && (
                                <div className="mb-3 flex items-center gap-1">
                                    <span className="text-xs text-gray-400 uppercase">Created By</span>
                                    <span className="text-xs text-green-400 font-medium uppercase">{creator.name}</span>
                                </div>
                            )}
                        </>
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

                .swiper-pagination {
                    bottom: 12px !important;
                }

                .swiper-pagination-bullet {
                    background: rgba(255, 255, 255, 0.45);
                    opacity: 1;
                    width: 8px;
                    height: 8px;
                    cursor: pointer;
                    transition: background-color 0.3s, transform 0.3s;
                }

                .swiper-pagination-bullet-active {
                    background: #60a5fa;
                    transform: scale(1.15);
                }

                .swiper-slide-thumb-active > div {
                    border-color: rgba(96, 165, 250, 0.9);
                    box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.3);
                }
            `}</style>
        </>
    );
};

export default PreviewGallery;
