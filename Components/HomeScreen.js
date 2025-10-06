// Components/HomeScreen.js
import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Pressable,
  Share,
  ScrollView,
  Dimensions,
  Alert,
  SafeAreaView,
} from 'react-native';
import { WebView } from 'react-native-webview';

import CustomTabBar from './CustomTabBar';
import JOKES from './jokes';
import { useSaved } from './SavedContext';

const { width } = Dimensions.get('window');

const ASSETS = {
  bgBlur: require('../assets/bg_blure.webp'),
  btnBg:  require('../assets/button.webp'),

  arrow:      require('../assets/arrow.webp'),
  bookmark:   require('../assets/bookmark.webp'),
  bookmarked: require('../assets/bookmark_fill.webp'),
  share:      require('../assets/share.webp'),
  close:      require('../assets/close.webp'),

  wolf: require('../assets/char-wolf.webp'),
  pigA: require('../assets/char-pig-a.webp'),
  pigB: require('../assets/char-pig-b.webp'),
  pigC: require('../assets/char-pig-c.webp'),
};

const C = {
  textOn:     '#ffffff',
  textDark:   '#0B2E10',
  buttonHi:   '#82D95A',
  outline:    '#1DAB5C',
  whiteFrame: 'rgba(255,255,255,0.96)',
};

const FONTS = { sigmar: 'Sigmar-Regular' };

const ORDER = ['wolf', 'pigA', 'pigB', 'pigC'];
const JOKE_TITLES = {
  wolf: 'A joke from a lion cub',
  pigA: 'A joke from Hrumko',
  pigB: 'A joke from Rokhasyk',
  pigC: 'A joke from Piskorokh',
};

/* HTML лоадера (упрощённая версия хомяка) */
const LOADER_HTML = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>
<style>
html,body{height:100%;margin:0;background:transparent;overflow:hidden}
.wrap{height:100%;display:grid;place-items:center;background:transparent}
.wheel-and-hamster{--dur:1s;position:relative;width:12em;height:12em;font-size:14px}
.wheel,.hamster,.hamster div,.spoke{position:absolute}
.wheel,.spoke{border-radius:50%;top:0;left:0;width:100%;height:100%}
.wheel{background:radial-gradient(100% 100% at center,hsla(0,0%,60%,0) 47.8%,hsl(0,0%,60%) 48%);z-index:2}
.hamster{animation:hamster var(--dur) ease-in-out infinite;top:50%;left:calc(50% - 3.5em);width:7em;height:3.75em;transform:rotate(4deg) translate(-0.8em,1.85em);transform-origin:50% 0;z-index:1}
.hamster__head{animation:hamsterHead var(--dur) ease-in-out infinite;background:hsl(30,90%,55%);border-radius:70% 30% 0 100% / 40% 25% 25% 60%;box-shadow:0 -0.25em 0 hsl(30,90%,80%) inset,0.75em -1.55em 0 hsl(30,90%,90%) inset;top:0;left:-2em;width:2.75em;height:2.5em;transform-origin:100% 50%}
.hamster__ear{animation:hamsterEar var(--dur) ease-in-out infinite;background:hsl(0,90%,85%);border-radius:50%;box-shadow:-0.25em 0 hsl(30,90%,55%) inset;top:-0.25em;right:-0.25em;width:0.75em;height:0.75em;transform-origin:50% 75%}
.hamster__eye{animation:hamsterEye var(--dur) linear infinite;background:#000;border-radius:50%;top:.375em;left:1.25em;width:.5em;height:.5em}
.hamster__nose{background:hsl(0,90%,75%);border-radius:35% 65% 85% 15% / 70% 50% 50% 30%;top:.75em;left:0;width:.2em;height:.25em}
.hamster__body{animation:hamsterBody var(--dur) ease-in-out infinite;background:hsl(30,90%,90%);border-radius:50% 30% 50% 30% / 15% 60% 40% 40%;box-shadow:.1em .75em 0 hsl(30,90%,55%) inset,.15em -.5em 0 hsl(30,90%,80%) inset;top:.25em;left:2em;width:4.5em;height:3em;transform-origin:17% 50%;transform-style:preserve-3d}
.hamster__limb--fr,.hamster__limb--fl{clip-path:polygon(0 0,100% 0,70% 80%,60% 100%,0% 100%,40% 80%);top:2em;left:.5em;width:1em;height:1.5em;transform-origin:50% 0}
.hamster__limb--fr{animation:hamsterFRLimb var(--dur) linear infinite;background:linear-gradient(hsl(30,90%,80%) 80%,hsl(0,90%,75%) 80%);transform:rotate(15deg) translateZ(-1px)}
.hamster__limb--fl{animation:hamsterFLLimb var(--dur) linear infinite;background:linear-gradient(hsl(30,90%,90%) 80%,hsl(0,90%,85%) 80%);transform:rotate(15deg)}
.hamster__tail{animation:hamsterTail var(--dur) linear infinite;background:hsl(0,90%,85%);border-radius:.25em 50% 50% .25em;box-shadow:0 -0.2em 0 hsl(0,90%,75%) inset;top:1.5em;right:-.5em;width:1em;height:.5em;transform:rotate(30deg) translateZ(-1px);transform-origin:.25em .25em}
.spoke{animation:spoke var(--dur) linear infinite;background:radial-gradient(100% 100% at center,hsl(0,0%,60%) 4.8%,hsla(0,0%,60%,0) 5%),linear-gradient(hsla(0,0%,55%,0) 46.9%,hsl(0,0%,65%) 47% 52.9%,hsla(0,0%,65%,0) 53%) 50% 50% / 99% 99% no-repeat}
@keyframes hamster{from,to{transform:rotate(4deg) translate(-0.8em,1.85em)}50%{transform:rotate(0) translate(-0.8em,1.85em)}}
@keyframes hamsterHead{from,25%,50%,75%,to{transform:rotate(0)}12.5%,37.5%,62.5%,87.5%{transform:rotate(8deg)}}
@keyframes hamsterEye{from,90%,to{transform:scaleY(1)}95%{transform:scaleY(0)}}
@keyframes hamsterBody{from,25%,50%,75%,to{transform:rotate(0)}12.5%,37.5%,62.5%,87.5%{transform:rotate(-2deg)}}
@keyframes spoke{from{transform:rotate(0)}to{transform:rotate(-1turn)}}
</style></head>
<body><div class="wrap">
  <div class="wheel-and-hamster">
    <div class="wheel"></div>
    <div class="hamster"><div class="hamster__body"><div class="hamster__head"><div class="hamster__ear"></div><div class="hamster__eye"></div><div class="hamster__nose"></div></div><div class="hamster__limb hamster__limb--fr"></div><div class="hamster__limb hamster__limb--fl"></div><div class="hamster__tail"></div></div></div>
    <div class="spoke"></div>
  </div>
</div></body></html>`;

/* ---------- Компонент ---------- */
export default function HomeScreen({ navigation }) {
  const [activeChar, setActiveChar] = useState('wolf');
  const [indexByChar, setIndexByChar] = useState({});
  const [stage, setStage] = useState('pick'); // стадии экрана: 'pick' | 'loading' | 'joke'
  const [showNext, setShowNext] = useState(false); // показывать ли стрелку после выбора

  const { toggleSave, isJokeSaved } = useSaved();
  const scRef = useRef(null);

  const joke = useMemo(() => {
    const idx = indexByChar[activeChar] ?? 0;
    const list = JOKES[activeChar] ?? [];
    return list[idx % Math.max(list.length, 1)] || '';
  }, [activeChar, indexByChar]);

  const isSaved = isJokeSaved(activeChar, indexByChar[activeChar] ?? 0);

  const nextJoke = () => {
    const listLen = (JOKES[activeChar] || []).length || 1;
    setIndexByChar((m) => ({ ...m, [activeChar]: ((m[activeChar] ?? 0) + 1) % listLen }));
    // Остаемся в режиме шутки, показываем новую шутку
    setStage('joke');
  };

  const backToCharacterSelection = () => {
    // Возвращаемся к выбору персонажа
    setStage('pick');
    setShowNext(false);
  };

  const handleToggleSave = async () => {
    await toggleSave(activeChar, indexByChar[activeChar] ?? 0, joke);
  };


  const shareJoke = async () => {
    try {
      await Share.share({ message: joke });
    } catch (e) {
      Alert.alert('Share error', String(e?.message || e));
    }
  };

   /* размеры карточки персонажа */
   const CARD_W = Math.min(0.80 * width, 320);
  const SIDE_PAD = (width - CARD_W) / 2;

  const onCarouselScrollEnd = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / CARD_W);
    const key = ORDER[Math.max(0, Math.min(idx, ORDER.length - 1))];
    if (key && key !== activeChar) {
      setActiveChar(key);
      setShowNext(true);
    }
  };

  const scrollToIndex = (idx) => {
    scRef.current?.scrollTo({ x: idx * CARD_W, animated: true });
  };

  const onPickChar = (k) => {
    const idx = ORDER.indexOf(k);
    if (idx >= 0) scrollToIndex(idx);
    setActiveChar(k);
    setShowNext(true); // подсветили — показали стрелку
  };

  const confirmCharacter = () => {
    // нажали стрелку → показываем лоадер, после паузы — шутку
    setStage('loading');
    setTimeout(() => setStage('joke'), 1200);
  };

  // Цвета фона для каждого персонажа
  const getCharacterBgColor = (character) => {
    const colors = {
      wolf: '#808080',    // серый
      pigA: '#00FF00',    // зеленый
      pigB: '#FF0000',    // красный
      pigC: '#FFA500',    // оранжевый
    };
    return colors[character] || '#E7C07B';
  };

  return (
    <ImageBackground source={ASSETS.bgBlur} style={styles.bg} resizeMode="cover">
      <SafeAreaView style={styles.container}>
        <View style={styles.overlay}>
          <ScrollView
            contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
            showsVerticalScrollIndicator={false}
          >
          {/* ABOUT */}
          <View style={styles.frame}>
            <View style={styles.capsule}>
              <Text style={styles.h1}>About the app:</Text>
              <Text style={styles.p}>
                Step into a world of laughter with Wolf and the Three Little Pigs! Each character —
                from the clever Wolf to Hrumko, Rokhasyk, and Piskorokh — shares unique jokes to brighten your day.
                Save your favorites, share with friends, or challenge each other in a fun game of humor.
              </Text>
              
              <Pressable style={styles.smallBtn} onPress={shareJoke}>
                <ImageBackground
                  source={ASSETS.btnBg}
                  style={styles.smallBtnBg}
                  imageStyle={styles.smallBtnBgImg}
                  resizeMode="stretch"
                >
                  <Image source={ASSETS.share} style={styles.btnIcon} />
                </ImageBackground>
              </Pressable>
            </View>
          </View>

          {/* СЕКЦИЯ ПОД ВЫБОР / ЛОАДЕР / ШУТКУ */}
          <View style={[styles.frame, { marginTop: 14 }]}>
            <View style={styles.capsule}>
              {stage === 'pick' && (
                <>
                  <Text style={styles.h2}>Choose a character:</Text>

                   <ScrollView
                     ref={scRef}
                     horizontal
                     snapToInterval={CARD_W}
                     decelerationRate="fast"
                     showsHorizontalScrollIndicator={false}
                     contentContainerStyle={{ 
                       paddingHorizontal: SIDE_PAD - 20,  // сдвигаем левее
                       alignItems: 'center'
                     }}
                      style={{ height: 320 }}
                     onMomentumScrollEnd={onCarouselScrollEnd}
                   >
                    {ORDER.map((k) => {
                      const active = activeChar === k;
                      return (
                         <Pressable
                           key={k}
                           onPress={() => onPickChar(k)}
                           style={[styles.cardContainer, { width: CARD_W }]}
                         >
                           <View style={[
                             styles.cardImageWrap, 
                             active && styles.cardImageWrapActive,
                             { backgroundColor: getCharacterBgColor(k) }
                           ]}>
                             <Image
                               source={ASSETS[k]}
                               defaultSource={ASSETS.wolf}
                               style={styles.cardImg}
                               resizeMode="contain"
                             />
                           </View>
                         </Pressable>
                      );
                    })}
                  </ScrollView>

                  {/* Появляющаяся стрелка подтверждения */}
                  {showNext && (
                    <Pressable onPress={confirmCharacter} style={styles.smallBtn}>
                      <ImageBackground
                        source={ASSETS.btnBg}
                        style={styles.smallBtnBg}
                        imageStyle={styles.smallBtnBgImg}
                        resizeMode="stretch"
                      >
                        <Image source={ASSETS.arrow} style={styles.btnIcon} />
                      </ImageBackground>
                    </Pressable>
                  )}
                </>
              )}

              {stage === 'loading' && (
                <View style={styles.loaderCard}>
                  <WebView
                    originWhitelist={['*']}
                    source={{ html: LOADER_HTML }}
                    style={{ width: 210, height: 210, backgroundColor: 'transparent' }}
                    scrollEnabled={false}
                  />
                </View>
              )}

              {stage === 'joke' && (
                <>
                  <Text style={[styles.h2, { marginTop: 0 }]}>{JOKE_TITLES[activeChar]}</Text>

                  <View style={styles.jokeBox}>
                    <View style={styles.jokeAvatar}>
                      <Image
                        source={ASSETS[activeChar]}
                        defaultSource={ASSETS.wolf}
                        style={styles.jokeAvatarImg}
                      />
                    </View>

                    <Text style={styles.jokeText}>{joke}</Text>

                    <View style={styles.actionsRow}>
                      <IconButton
                        source={isSaved ? ASSETS.bookmarked : ASSETS.bookmark}
                        onPress={handleToggleSave}
                      />
                      <IconButton source={ASSETS.share} onPress={async () => {
                        try { await Share.share({ message: joke }); } catch {}
                      }} />
                      <IconButton source={ASSETS.close} onPress={backToCharacterSelection} />
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
      </SafeAreaView>
      
      <CustomTabBar
        active="home"
        onHome={() => navigation.replace('Home')}
        onSaved={() => navigation.navigate('Saved')}
        onGame={() => navigation.navigate('GameSetup')}
      />
    </ImageBackground>
  );
}

/* ------- мелкий компонент ------- */
function IconButton({ source, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.iconBtn}>
      <ImageBackground
        source={ASSETS.btnBg}
        style={styles.iconBtnBg}
        imageStyle={styles.iconBtnBgImg}
        resizeMode="stretch"
      >
        <Image source={source} style={styles.icon24} />
      </ImageBackground>
    </Pressable>
  );
}

/* ---------- styles ---------- */
const R = 22;

const styles = StyleSheet.create({
  container: { flex: 1 },
  bg: { flex: 1 },
  overlay: { flex: 1 },

  frame: {
    borderWidth: 3,
    borderColor: C.whiteFrame,
    borderRadius: R + 6,
    padding: 6,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },

  capsule: {
    width: '100%',
    borderRadius: R,
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
    // Добавляем размытие
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },

  h1: {
    color: '#F4E4BC',  // песочный цвет
    fontFamily: FONTS.sigmar,
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowRadius: 6,
  },
  h2: {
    color: '#F4E4BC',  // песочный цвет
    fontFamily: FONTS.sigmar,
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowRadius: 5,
  },
  p: {
    color: '#F4E4BC',  // песочный цвет
    fontWeight: '800',
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 12,
  },

  /* Кнопки-капсулы */
  smallBtn: {
    alignSelf: 'center',
    width: 118,
    height: 92,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  smallBtnBg: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  smallBtnBgImg: { borderRadius: 14 },
  btnIcon: { width: 38, height: 38, resizeMode: 'contain' },

    /* Карточки персонажей */
    cardContainer: {
      alignItems: 'flex-start',  // выравниваем по левому краю
      justifyContent: 'center',
      paddingVertical: 20,
      paddingLeft: 10,           // добавляем отступ слева
      height: 280,            // увеличим высоту контейнера
      marginVertical: 10,     // увеличим отступы
    },
   cardImageWrap: {
     width: '85%',           // уменьшим ширину чтобы не обрезалось
     aspectRatio: 1,         // квадратная форма
     borderRadius: 24,       // увеличим радиус
     borderWidth: 0,         // убираем обводку по умолчанию
     borderColor: 'transparent',
     overflow: 'hidden',
     backgroundColor: '#E7C07B',  // дефолтный цвет
     alignItems: 'center',
     justifyContent: 'center',
     padding: 15,            // увеличим внутренний отступ для центрирования
     // Добавляем размытие
     shadowColor: 'rgba(0, 0, 0, 0.2)',
     shadowOffset: { width: 0, height: 1 },
     shadowOpacity: 0.6,
     shadowRadius: 4,
     elevation: 4,
   },
   cardImageWrapActive: { 
     borderWidth: 6,         // обводка только для активной карточки
     borderColor: '#FFD700'  // золотая рамка для активной
   },
   cardImg: { 
     width: '100%', 
     height: '100%',
     resizeMode: 'contain'   // contain для правильного отображения без обрезки
   },

  /* Лоадер */
  loaderCard: {
    alignSelf: 'center',
    width: 240,
    height: 240,
    borderRadius: 24,
    backgroundColor: 'rgba(32,32,38,0.86)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },

  /* Шутка */
  jokeBox: { alignItems: 'stretch' },
   jokeAvatar: {
     alignSelf: 'center',
     width: 190,  // увеличили с 120 до 160
     height: 190, // увеличили с 120 до 160
     borderRadius: 20, // увеличили радиус
     overflow: 'hidden',
     marginBottom: 15, // увеличили отступ
     backgroundColor: '#E7C07B',
     borderWidth: 5, // увеличили толщину рамки
     borderColor: '#fff',
   },
  jokeAvatarImg: { width: '100%', height: '100%' ,  padding:12,resizeMode:'contain',},
  jokeText: {
    color: '#fff',
    fontFamily: FONTS.sigmar,
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowRadius: 6,
  },
  actionsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
  },
  iconBtn: {
    height: 92,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnBg: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  iconBtnBgImg: { borderRadius: 12 },
  icon24: { width: 24, height: 24, resizeMode: 'contain' },
});
