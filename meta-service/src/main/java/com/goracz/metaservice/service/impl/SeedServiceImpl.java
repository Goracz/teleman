package com.goracz.metaservice.service.impl;

import com.goracz.metaservice.entity.ChannelCategory;
import com.goracz.metaservice.entity.ChannelMetadata;
import com.goracz.metaservice.repository.ReactiveSortingChannelMetadataRepository;
import com.goracz.metaservice.service.SeedService;

import org.springframework.stereotype.Service;

import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.List;

@Service
public class SeedServiceImpl implements SeedService {
    private final ReactiveSortingChannelMetadataRepository channelMetadataRepository;

    public SeedServiceImpl(ReactiveSortingChannelMetadataRepository channelMetadataRepository) {
        this.channelMetadataRepository = channelMetadataRepository;
        this.seedChannelMetadata()
                .log()
                .subscribeOn(Schedulers.boundedElastic())
                .subscribe();
    }

    @Override
    public Mono<Void> seedChannelMetadata() {
        this.channelMetadataRepository
                .deleteAll()
                .log()
                .subscribeOn(Schedulers.boundedElastic())
                .subscribe();

        // TODO: Do not use 3rd party image URLs directly.
        //  Download the images and host them on our own.
        this.channelMetadataRepository.saveAll(List.of(
                ChannelMetadata.builder()
                        .channelName("M1")
                        .channelCategory(ChannelCategory.NEWS_AND_PUBLIC_SERVICE_AND_CULTURAL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/m1.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("M1 HD")
                        .channelCategory(ChannelCategory.NEWS_AND_PUBLIC_SERVICE_AND_CULTURAL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/m1HD.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("M2 / Petőfi TV")
                        .channelCategory(ChannelCategory.KIDS)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/m2.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("M2 / Petőfi TV HD")
                        .channelCategory(ChannelCategory.KIDS)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/m2HD.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("DUNA")
                        .channelCategory(ChannelCategory.NEWS_AND_PUBLIC_SERVICE_AND_CULTURAL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/duna.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("DUNA HD")
                        .channelCategory(ChannelCategory.NEWS_AND_PUBLIC_SERVICE_AND_CULTURAL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/dunaHD.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("M4 Sport")
                        .channelCategory(ChannelCategory.SPORTS)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_M4_sport.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("M4 Sport HD")
                        .channelCategory(ChannelCategory.SPORTS)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_M4_sport.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("DUNA W/M4 Sport+")
                        .channelCategory(ChannelCategory.NEWS_AND_PUBLIC_SERVICE_AND_CULTURAL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/duna_world.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("DUNA W/M4 Sport+ HD")
                        .channelCategory(ChannelCategory.NEWS_AND_PUBLIC_SERVICE_AND_CULTURAL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/duna_worldHD.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("M5")
                        .channelCategory(ChannelCategory.NEWS_AND_PUBLIC_SERVICE_AND_CULTURAL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_M5.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("M5 HD")
                        .channelCategory(ChannelCategory.NEWS_AND_PUBLIC_SERVICE_AND_CULTURAL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_M5_HD.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("hatoscsatorna")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_hatoscsatorna.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("DIGI Info")
                        .channelCategory(ChannelCategory.LOCAL_CHANNEL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_DIGI.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("DIGI Sport 1")
                        .channelCategory(ChannelCategory.SPORTS)
                        .channelLogoUrl("https://ewsat.com/img/DIGI_SPORT_1.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("DIGI Sport 1 HD")
                        .channelCategory(ChannelCategory.SPORTS)
                        .channelLogoUrl("http://csatornakiosztas.hu/images/digisport1_hd.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("DIGI Sport 2")
                        .channelCategory(ChannelCategory.SPORTS)
                        .channelLogoUrl("https://ewsat.com/img/DIGI_SPORT_2.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("DIGI Sport 2 HD")
                        .channelCategory(ChannelCategory.SPORTS)
                        .channelLogoUrl("https://www.sat-tv-radio.hu/images/stories/tv/cable/digisport2_hd.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("DIGI Sport 3")
                        .channelCategory(ChannelCategory.SPORTS)
                        .channelLogoUrl("https://www.coolstreaming.us/img/ch/image41244484205.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("DIGI Sport 3 HD")
                        .channelCategory(ChannelCategory.SPORTS)
                        .channelLogoUrl("https://dtvnews.hu/sites/default/files/images/digi_sport_3_hd_large.w160.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("DIGI World HD")
                        .channelCategory(ChannelCategory.EDUCATIONAL)
                        .channelLogoUrl("https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Digi_World.png/1200px-Digi_World.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("PAX TV")
                        .channelCategory(ChannelCategory.LIFESTYLE)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_pax.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("d1 TV")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_d1tv.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("FILMBOX")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_fb.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("16TV")
                        .channelCategory(ChannelCategory.LOCAL_CHANNEL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/LOGO%2016TV%20PNG.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("The Fishing & Hunting")
                        .channelCategory(ChannelCategory.SPORTS)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_fishinghunting%20sd.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("The Fishing & Hunting HD")
                        .channelCategory(ChannelCategory.SPORTS)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_fishinghunting%20sd.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("AMC HD")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_AMC.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("duck tv")
                        .channelCategory(ChannelCategory.KIDS)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_DuckTV.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("ID TV")
                        .channelCategory(ChannelCategory.EDUCATIONAL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_id.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("ID HD")
                        .channelCategory(ChannelCategory.EDUCATIONAL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_id.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("DS TV")
                        .channelCategory(ChannelCategory.LOCAL_CHANNEL)
                        .channelLogoUrl("https://scontent.fbud5-1.fna.fbcdn.net/v/t39.30808-6/301456091_535484625136690_3972487870532778569_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=8actWWzK5bkAX8-f4Gr&_nc_ht=scontent.fbud5-1.fna&oh=00_AfBW9jOzQC5UpJ7iSlobEYV_9mpHXOigqX8JgwPMUAU1yg&oe=6362DE32")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("D+ TV HD")
                        .channelCategory(ChannelCategory.LOCAL_CHANNEL)
                        .channelLogoUrl("https://dplusztv.hu/wp-content/uploads/2019/03/cropped-web_hd200-1.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("SAT1")
                        .channelCategory(ChannelCategory.FOREIGN)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_SAT.1.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("TeenNick")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_teenick.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("9.TV")
                        .channelCategory(ChannelCategory.LOCAL_CHANNEL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/9ponttvlogo.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("ATV")
                        .channelCategory(ChannelCategory.NEWS_AND_PUBLIC_SERVICE_AND_CULTURAL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_ATV.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("COOL TV HD")
                        .channelCategory(ChannelCategory.MOVIES_EXTRA)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_coolHD.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Eurosport 2")
                        .channelCategory(ChannelCategory.SPORTS)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_ESP2.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("JimJam")
                        .channelCategory(ChannelCategory.KIDS)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_jimjam.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("XV. TV")
                        .channelCategory(ChannelCategory.LOCAL_CHANNEL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_xvtv.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Da Vinci")
                        .channelCategory(ChannelCategory.EDUCATIONAL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_da%20vinci%20primary.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Super TV2")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_SuperTV2_black.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Spektrum HD")
                        .channelCategory(ChannelCategory.EDUCATIONAL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_spektrum.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Viasat History HD")
                        .channelCategory(ChannelCategory.EDUCATIONAL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_Viasat_history_HD.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Hegyvidék TV")
                        .channelCategory(ChannelCategory.LOCAL_CHANNEL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_htv.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("H!T Music Channel")
                        .channelCategory(ChannelCategory.MUSIC)
                        .channelLogoUrl("https://static.wikia.nocookie.net/logopedia/images/d/d2/H%21T_Music_Channel_%282012-2013%29.png/revision/latest/scale-to-width-down/300?cb=20160630155227")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Spíler1 TV")
                        .channelCategory(ChannelCategory.SPORTS)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_spiler_1.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("SPORT1")
                        .channelCategory(ChannelCategory.SPORTS)
                        .channelLogoUrl("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd6pZVQ8EaS4kdgD5H5zEi3rLPkN2CMBVHLTRLL2MZ_R3-QIyoR8d9XalzsnRS2Xm1qGA&usqp=CAU")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Epic Drama HD")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_epic_drama.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("RTL Klub HD")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_rtl_HD.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("ZUGLÓ TV (TESZT)")
                        .channelCategory(ChannelCategory.LOCAL_CHANNEL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_zuglo_tv.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("RTLII")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_rtl2.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Apostol TV")
                        .channelCategory(ChannelCategory.LIFESTYLE)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_apostol.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Story4")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_story4.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("RTL+")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_rtlplusz.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Spíler 2 TV HD")
                        .channelCategory(ChannelCategory.SPORTS)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_spiler_2_HD.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("TV2 HD")
                        .channelCategory(ChannelCategory.NEWS_AND_PUBLIC_SERVICE_AND_CULTURAL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_TV2HD.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Comedy Central")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_comedy.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("CNN")
                        .channelCategory(ChannelCategory.FOREIGN)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_CNN.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("HISTORY HD")
                        .channelCategory(ChannelCategory.EDUCATIONAL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_History_HD.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Mozi+ HD")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_moziplusz.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("MTV HUNGARY")
                        .channelCategory(ChannelCategory.MUSIC)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_MTV.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("MTV European")
                        .channelCategory(ChannelCategory.MUSIC)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_MTV.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("MTV 00s")
                        .channelCategory(ChannelCategory.MUSIC)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_mtv00.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("TV10")
                        .channelCategory(ChannelCategory.LOCAL_CHANNEL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_tv10.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("TVE")
                        .channelCategory(ChannelCategory.FOREIGN)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_TVE.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("NAT GEO WILD")
                        .channelCategory(ChannelCategory.EDUCATIONAL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_Nat_Geo_Wild.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("MATCH4")
                        .channelCategory(ChannelCategory.SPORTS)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_match4.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("MATCH4 HD")
                        .channelCategory(ChannelCategory.SPORTS)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_match4.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Travel")
                        .channelCategory(ChannelCategory.LIFESTYLE)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_travel_channel%20uj.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Eurosport HD")
                        .channelCategory(ChannelCategory.SPORTS)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_ESP1.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Nat Geo HD")
                        .channelCategory(ChannelCategory.EDUCATIONAL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_NatGeo_HD.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("VIASAT FILM")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_Viasat_film.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Eurosport 2 HD")
                        .channelCategory(ChannelCategory.SPORTS)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_ESP2.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Sport 1 HD")
                        .channelCategory(ChannelCategory.SPORTS)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_sport1hd.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Sport 2 HD")
                        .channelCategory(ChannelCategory.SPORTS)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Sport2.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Paramount Network")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/paramount-network-logo.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Super TV2 HD")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_SuperTV2HD_black.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("HETI TV")
                        .channelCategory(ChannelCategory.LOCAL_CHANNEL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/HETITV_LOGO.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("PRO TV INTERNATIONAL")
                        .channelCategory(ChannelCategory.FOREIGN)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_ProTV_International.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Nicktoons")
                        .channelCategory(ChannelCategory.KIDS)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_nicktoons.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("EWTN")
                        .channelCategory(ChannelCategory.NEWS_AND_PUBLIC_SERVICE_AND_CULTURAL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_ewtn.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("SPORT2")
                        .channelCategory(ChannelCategory.SPORTS)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_Sport2.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Rai Uno")
                        .channelCategory(ChannelCategory.FOREIGN)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_Rai_Uno.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("FIX HD")
                        .channelCategory(ChannelCategory.EDUCATIONAL)
                        .channelLogoUrl("https://www.ujletoltes.hu/Tv/fix-online-tv.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("TV18")
                        .channelCategory(ChannelCategory.LOCAL_CHANNEL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_TV18.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("SPÍLER1 TV HD")
                        .channelCategory(ChannelCategory.SPORTS)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_spiler_1_HD.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Boomerang")
                        .channelCategory(ChannelCategory.KIDS)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_boomerang.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("CENTRUM TV")
                        .channelCategory(ChannelCategory.LOCAL_CHANNEL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/centrum-tv.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("HGTV")
                        .channelCategory(ChannelCategory.EDUCATIONAL)
                        .channelLogoUrl("https://upload.wikimedia.org/wikipedia/commons/a/a8/HGTV_2010.svg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Bloomberg TV")
                        .channelCategory(ChannelCategory.FOREIGN)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_Bloomberg_TV.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("VIASAT2")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_Viasat2.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("CBS Reality")
                        .channelCategory(ChannelCategory.EDUCATIONAL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_CBS_reality.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("RTLII HD")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_rtl2_HD.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Discovery Channel")
                        .channelCategory(ChannelCategory.EDUCATIONAL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_Discovery%20Channel_black.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Hír TV")
                        .channelCategory(ChannelCategory.NEWS_AND_PUBLIC_SERVICE_AND_CULTURAL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_HirTV.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("VIASAT3")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_Viasat3.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("VIASAT6")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_TV6.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Disney Channel")
                        .channelCategory(ChannelCategory.KIDS)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_Disney_Channel.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("FILM+")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_filmplusz.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Film Café HD")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_filmcafe.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("TV PAPRIKA")
                        .channelCategory(ChannelCategory.LIFESTYLE)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/tvpaprika_uj_logo_csatornakiosztas.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Izaura TV")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_Izaura.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("RTL")
                        .channelCategory(ChannelCategory.NEWS_AND_PUBLIC_SERVICE_AND_CULTURAL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_rtl.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Galaxy4")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_galaxy4.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("NATIONAL GEOGRAPHIC CHANNEL")
                        .channelCategory(ChannelCategory.EDUCATIONAL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_National_Geographic_Channel.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("National Geographic Wild HD")
                        .channelCategory(ChannelCategory.EDUCATIONAL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_Nat_Geo_Wild_HD.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("ATV SPIRIT")
                        .channelCategory(ChannelCategory.LIFESTYLE)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_ATV_spirit1.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Deutsche Welle")
                        .channelCategory(ChannelCategory.FOREIGN)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_DWTV.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Jocky TV")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_jocky_kicsi.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("SLÁGER TV")
                        .channelCategory(ChannelCategory.MUSIC)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_slagertv.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Sky News")
                        .channelCategory(ChannelCategory.FOREIGN)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_Sky_News.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("VIASAT NATURE")
                        .channelCategory(ChannelCategory.EDUCATIONAL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_Viasat_nature.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Spektrum Home")
                        .channelCategory(ChannelCategory.LIFESTYLE)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_spektrum_home.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("RTL Gold")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_RTL_Gold.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Dikh TV")
                        .channelCategory(ChannelCategory.MUSIC)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_dikhtv.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Paramount Network HD")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://upload.wikimedia.org/wikipedia/commons/f/fe/Paramount_Network_%28Black%29_Logo.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("ARENA4")
                        .channelCategory(ChannelCategory.SPORTS)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_arena4.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("ARENA4 HD")
                        .channelCategory(ChannelCategory.SPORTS)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_arena4.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("AMC")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_AMC.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Animal Planet HD")
                        .channelCategory(ChannelCategory.FOREIGN)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_animal_planet.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("TV2 Comedy")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_tv2comedy.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Zenebutik")
                        .channelCategory(ChannelCategory.MUSIC)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_Zenebutik.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Music Channel")
                        .channelCategory(ChannelCategory.MUSIC)
                        .channelLogoUrl("https://upload.wikimedia.org/wikipedia/commons/a/a7/Music_channel.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Music Channel HD")
                        .channelCategory(ChannelCategory.MUSIC)
                        .channelLogoUrl("https://upload.wikimedia.org/wikipedia/commons/a/a7/Music_channel.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Film4")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_film4.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("ATV HD")
                        .channelCategory(ChannelCategory.NEWS_AND_PUBLIC_SERVICE_AND_CULTURAL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_ATV.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Moziverzum")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_moziverzum_kicsi.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("TV2 Séf")
                        .channelCategory(ChannelCategory.LIFESTYLE)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_tv2_sef.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Film+ HD")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_filmpluszHD.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Comedy Central Family")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_comedy_family.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("TV4")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_TV4.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("COOL TV")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_cool.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Prime")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_prime.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("TLC")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_TLC.PNG")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Muzsika TV")
                        .channelCategory(ChannelCategory.MUSIC)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_muzsikaTV.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("LifeTV")
                        .channelCategory(ChannelCategory.EDUCATIONAL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_Life.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("TV2 Kids")
                        .channelCategory(ChannelCategory.KIDS)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_tv2_kids.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Viasat Explore")
                        .channelCategory(ChannelCategory.EDUCATIONAL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_Viasat_explore.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Spektrum")
                        .channelCategory(ChannelCategory.EDUCATIONAL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_spektrum.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("VIASAT HISTORY")
                        .channelCategory(ChannelCategory.EDUCATIONAL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_Viasat_history.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("TV Paprika HD")
                        .channelCategory(ChannelCategory.LIFESTYLE)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/tvpaprika_uj_logo_csatornakiosztas.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Nick Jr.")
                        .channelCategory(ChannelCategory.KIDS)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_Nick_JR.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Nickelodeon")
                        .channelCategory(ChannelCategory.KIDS)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_Nickelodeon.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Nickelodeon Ukraine Pluto TV")
                        .channelCategory(ChannelCategory.KIDS)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_Nickelodeon.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("RÁKOSMENTE TV")
                        .channelCategory(ChannelCategory.LOCAL_CHANNEL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_RMTV.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Eurosport TV")
                        .channelCategory(ChannelCategory.SPORTS)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_ESP1.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("ATV Spirit HD")
                        .channelCategory(ChannelCategory.LIFESTYLE)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_ATV_spirit1.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("TV 13")
                        .channelCategory(ChannelCategory.LOCAL_CHANNEL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/tv13.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Pro7")
                        .channelCategory(ChannelCategory.FOREIGN)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_Pro7.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("ProTV International")
                        .channelCategory(ChannelCategory.FOREIGN)
                        .channelLogoUrl("https://tx.gcntv.net/channels/logo/protv-international.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("AXN")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_axn_uj.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Sorozat+")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_sorozatplusz.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("SLÁGER TV HD")
                        .channelCategory(ChannelCategory.MUSIC)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_slagertv.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Spíler2 TV")
                        .channelCategory(ChannelCategory.SPORTS)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_spiler_2.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Viasat Nature HD")
                        .channelCategory(ChannelCategory.EDUCATIONAL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_Viasat_nature_HD.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Mezzo")
                        .channelCategory(ChannelCategory.FOREIGN)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_Mezzo.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("BBC Earth")
                        .channelCategory(ChannelCategory.EDUCATIONAL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_BBC_earth.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("MOZI+")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_moziplusz.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("VÖLGYHÍD TV")
                        .channelCategory(ChannelCategory.LOCAL_CHANNEL)
                        .channelLogoUrl("https://yt3.ggpht.com/ytc/AMLnZu9vbUrCENPF2yqBr37kqUPDUp0RBbLyu7RgzO8JSA=s900-c-k-c0x00ffffff-no-rj")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Minimax")
                        .channelCategory(ChannelCategory.KIDS)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_minimax_uj.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Cartoon Network")
                        .channelCategory(ChannelCategory.KIDS)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_Cartoon_Network.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Dikh TV HD")
                        .channelCategory(ChannelCategory.MUSIC)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_dikhtv.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Magyar Sláger TV HD")
                        .channelCategory(ChannelCategory.MUSIC)
                        .channelLogoUrl("https://slagertv.tv/img/logo-white.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("FEM3")
                        .channelCategory(ChannelCategory.LIFESTYLE)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_FEM3.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("TV2")
                        .channelCategory(ChannelCategory.NEWS_AND_PUBLIC_SERVICE_AND_CULTURAL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_TV2.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("HISTORY")
                        .channelCategory(ChannelCategory.EDUCATIONAL)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_History.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("CCTV4")
                        .channelCategory(ChannelCategory.FOREIGN)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_CCTV-4.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Film Café")
                        .channelCategory(ChannelCategory.MOVIES_AND_SERIES_AND_ENTERTAINMENT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_filmcafe.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("SuperONE HD")
                        .channelCategory(ChannelCategory.ADULT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_SuperOne_HD.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("SuperONE SD")
                        .channelCategory(ChannelCategory.ADULT)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_SuperOne_HD.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("HBO")
                        .channelCategory(ChannelCategory.MOVIES_EXTRA)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_HBO.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("HBO HD")
                        .channelCategory(ChannelCategory.MOVIES_EXTRA)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_HBO.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("HBO 2")
                        .channelCategory(ChannelCategory.MOVIES_EXTRA)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_HBO2.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("HBO 2 HD")
                        .channelCategory(ChannelCategory.MOVIES_EXTRA)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/Logo_HBO2.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("HBO 3")
                        .channelCategory(ChannelCategory.MOVIES_EXTRA)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_hbo3.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("HBO 3 HD")
                        .channelCategory(ChannelCategory.MOVIES_EXTRA)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_hbo3.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Cinemax")
                        .channelCategory(ChannelCategory.MOVIES_EXTRA)
                        .channelLogoUrl("https://upload.wikimedia.org/wikipedia/commons/1/15/Cinemax_new.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Cinemax 2 HD")
                        .channelCategory(ChannelCategory.MOVIES_EXTRA)
                        .channelLogoUrl("https://nstatic.net/img/tv/channels/m/cinemax-2.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Cinemax HD")
                        .channelCategory(ChannelCategory.MOVIES_EXTRA)
                        .channelLogoUrl("https://www.pngfind.com/pngs/m/498-4988800_cinemax-cinemax-hd-logo-hd-png-download.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("Cinemax 2")
                        .channelCategory(ChannelCategory.MOVIES_EXTRA)
                        .channelLogoUrl("https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Cinemax2.jpg/250px-Cinemax2.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("FilmBox")
                        .channelCategory(ChannelCategory.MOVIES_EXTRA)
                        .channelLogoUrl("https://upload.wikimedia.org/wikipedia/commons/4/45/Filmbox_pl.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("FilmBox Family")
                        .channelCategory(ChannelCategory.MOVIES_EXTRA)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_FB_family.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("FilmBox Stars")
                        .channelCategory(ChannelCategory.MOVIES_EXTRA)
                        .channelLogoUrl("https://digi.hu/sites/default/files/channelicons/logo_filmbox_stars.jpg")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("FilmBox Extra HD")
                        .channelCategory(ChannelCategory.MOVIES_EXTRA)
                        .channelLogoUrl("https://spiintl.com/data/files/kcfinderUploadDir/images/logo/filmboxextrahd-logo.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("FilmBox PREMIUM")
                        .channelCategory(ChannelCategory.MOVIES_EXTRA)
                        .channelLogoUrl("https://upload.wikimedia.org/wikipedia/commons/b/b5/FilmBox_Premium_log.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("KOSSUTH RÁDIÓ")
                        .channelCategory(ChannelCategory.RADIO)
                        .channelLogoUrl("https://upload.wikimedia.org/wikipedia/hu/6/69/Mr1.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("PETŐFI RÁDIÓ")
                        .channelCategory(ChannelCategory.RADIO)
                        .channelLogoUrl("https://upload.wikimedia.org/wikipedia/hu/thumb/0/0c/MR2-Pet%C5%91fi.png/1200px-MR2-Pet%C5%91fi.png")
                        .build(),
                ChannelMetadata.builder()
                        .channelName("BARTÓK RÁDIÓ")
                        .channelCategory(ChannelCategory.RADIO)
                        .channelLogoUrl("https://upload.wikimedia.org/wikipedia/hu/thumb/c/ce/MR3-BARTOK.png/1200px-MR3-BARTOK.png")
                        .build()
        ))
                .log()
                .subscribeOn(Schedulers.boundedElastic())
                .subscribe();

        return Mono.empty();
    }
}
