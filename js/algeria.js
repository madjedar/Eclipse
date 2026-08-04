// ═══════════════════════════════════════════════════════════════════
// Eclipse Store — Algeria Administrative Data
// All 58 Wilayas (Provinces) and their Communes (Municipalities)
// ═══════════════════════════════════════════════════════════════════

window.ALGERIA_DATA = (function () {
  'use strict';

  const wilayas = [
    { code: '01', name: 'Adrar' },
    { code: '02', name: 'Chlef' },
    { code: '03', name: 'Laghouat' },
    { code: '04', name: 'Oum El Bouaghi' },
    { code: '05', name: 'Batna' },
    { code: '06', name: 'Béjaïa' },
    { code: '07', name: 'Biskra' },
    { code: '08', name: 'Béchar' },
    { code: '09', name: 'Blida' },
    { code: '10', name: 'Bouira' },
    { code: '11', name: 'Tamanrasset' },
    { code: '12', name: 'Tébessa' },
    { code: '13', name: 'Tlemcen' },
    { code: '14', name: 'Tiaret' },
    { code: '15', name: 'Tizi Ouzou' },
    { code: '16', name: 'Alger' },
    { code: '17', name: 'Djelfa' },
    { code: '18', name: 'Jijel' },
    { code: '19', name: 'Sétif' },
    { code: '20', name: 'Saïda' },
    { code: '21', name: 'Skikda' },
    { code: '22', name: 'Sidi Bel Abbès' },
    { code: '23', name: 'Annaba' },
    { code: '24', name: 'Guelma' },
    { code: '25', name: 'Constantine' },
    { code: '26', name: 'Médéa' },
    { code: '27', name: 'Mostaganem' },
    { code: '28', name: "M'Sila" },
    { code: '29', name: 'Mascara' },
    { code: '30', name: 'Ouargla' },
    { code: '31', name: 'Oran' },
    { code: '32', name: 'El Bayadh' },
    { code: '33', name: 'Illizi' },
    { code: '34', name: 'Bordj Bou Arréridj' },
    { code: '35', name: 'Boumerdès' },
    { code: '36', name: 'El Tarf' },
    { code: '37', name: 'Tindouf' },
    { code: '38', name: 'Tissemsilt' },
    { code: '39', name: 'El Oued' },
    { code: '40', name: 'Khenchela' },
    { code: '41', name: 'Souk Ahras' },
    { code: '42', name: 'Tipaza' },
    { code: '43', name: 'Mila' },
    { code: '44', name: 'Aïn Defla' },
    { code: '45', name: 'Naâma' },
    { code: '46', name: 'Aïn Témouchent' },
    { code: '47', name: 'Ghardaïa' },
    { code: '48', name: 'Relizane' },
    { code: '49', name: 'Timimoun' },
    { code: '50', name: 'Bordj Badji Mokhtar' },
    { code: '51', name: 'Ouled Djellal' },
    { code: '52', name: 'Béni Abbès' },
    { code: '53', name: 'In Salah' },
    { code: '54', name: 'In Guezzam' },
    { code: '55', name: 'Touggourt' },
    { code: '56', name: 'Djanet' },
    { code: '57', name: "El M'Ghair" },
    { code: '58', name: 'El Meniaa' }
  ];

  // Communes mapped by wilaya code
  const communes = {
    '01': ['Adrar','Akabli','Aoulef','Bouda','Fenoughil','In Zghmir','Ouled Ahmed Tammi','Reggane','Sali','Sbaa','Tamantit','Tamekten','Tamest','Tit','Tsabit','Zaouiet Kounta'],
    '02': ['Abou El Hassan','Aïn Merane','Bénairia','Beni Bouateb','Beni Haoua','Beni Rached','Boukadir','Bouzeghaia','Breira','Chettia','Chlef','Dahra','El Hadjadj','El Karimia','El Marsa','Harchoun','Harenfa','Labiod Medjadja','Moussadek','Oued Fodda','Oued Goussine','Oued Sly','Ouled Abbes','Ouled Ben Abdelkader','Ouled Fares','Sendjas','Sidi Abderrahmane','Sidi Akkacha','Sobha','Tadjena','Talassa','Taougrite','Ténès','Zeboudja'],
    '03': ['Aflou','Aïn Madhi','Aïn Sidi Ali','Beidha','Bennasser Benchohra','Brida','El Assafia','El Ghicha','El Houaita','Gueltat Sidi Saad','Hadj Mechri','Hassi Delaa',"Hassi R'Mel",'Kheneg','Ksar El Hirane','Laghouat','Oued Morra',"Oued M'Zi",'Sebgag','Sidi Bouzid','Sidi Makhlouf','Tadjemout','Tadjrouna','Taouiala'],
    '04': ['Aïn Babouche','Aïn Beïda','Aïn Diss','Aïn Fakroun','Aïn Kercha',"Aïn M'lila",'Aïn Zitoun','Behir Chergui','Berriche','Bir Chouhada','Dhalaa','El Amiria','El Belala','El Djazia','El Fedjoudj Boughrara Saoudi','El Harmilia','Fkirina','Hanchir Toumghani','Ksar Sbahi','Meskiana','Oued Nini','Ouled Gacem','Ouled Hamla','Ouled Zouaï','Oum El Bouaghi','Rahia','Sigus','Souk Naamane','Zorg'],
    '05': ['Abdelkader Azil','Aïn Djasser','Aïn Touta','Aïn Yagout','Arris','Barika','Batna','Ben Foudhala El Hakania','Bitam','Boulhilat','Boumagueur','Boumia','Bouzina','Chemora','Chir','Djerma','Djezzar','El Hassi','El Madher','Fesdis','Foum Toub','Ghassira','Gosbat','Guigba','Hidoussa','Ichemoul','Inoughissen','Kimmel','Ksar Bellezma','Larbaa','Lazrou','Lemsane','Maafa','Menaa','Merouana',"N'Gaous",'Oued Chaaba','Oued El Ma','Oued Taga','Ouled Aouf','Ouled Fadel','Ouled Selem','Ouled Si Slimane','Ouyoun El Assafir','Rahbat','Ras El Aioun','Sefiane','Seggana','Seriana','Talkhamt','Taxlent','Tazoult','Teniet El Abed','Tighanimine','Tigharghar','Timgad',"T'Kout",'Tilatou','Zanet El Beida'],
    '06': ['Adekar','Aït-R\'zine','Aït-Smail','Akbou','Akfadou','Amalou','Amizour','Aokas','Barbacha','Béjaïa','Beni Djellil','Beni Ksila','Beni Maouche','Beni Mellikeche','Boudjellil','Bouhamza','Boukhelifa','Chellata','Chemini','Darguina','Draâ El-Kaïd','El Kseur','Fenaïa Ilmaten','Ferraoun','Ighil Ali','Ighram','Kendira','Kherrata','Leflaye','M\'cisna','Melbou','Oued Ghir','Ouzellaguen','Seddouk','Semaoune','Sidi-Aïch','Sidi-Ayad','Souk El Ténine','Souk-Oufella','Tala Hamza','Tamokra','Tamridjet','Taourirt Ighil','Taskriout','Tazmalt','Tibane','Tichy','Tifra','Timezrit','Tinabdher','Tizi N\'Berber','Toudja'],
    '07': ['Aïn Naga','Aïn Zaatout','Biskra','Bordj Ben Azzouz','Bouchagroune','Branis','Chetma','Djemorah','El Feidh','El Ghrous','El Hadjeb','El Haouch','El Kantara','El Mizaraa','El Outaya','Foughala','Khenguet Sidi Nadji','Lichana','Lioua','M\'Chouneche','Mekhadma','M\'Lili','Oumache','Ourlal','Sidi Okba','Tolga','Zeribet El Oued'],
    '08': ['Abadla','Béchar','Beni Ounif','Boukaïs','Erg Ferradj','Kenadsa','Lahmar','Mechraa Houari Boumedienne','Méridja','Mogheul','Taghit'],
    '09': ['Aïn Romana','Beni Mered','Beni Tamou','Benkhelil','Blida','Bouarfa','Boufarik','Bougara','Bouinan','Chebli','Chiffa','Chréa','Djebabra','El Affroun','Guerrouaou','Hammam Melouane','Larbaâ','Meftah','Mouzaïa','Oued Djer','Oued El Alleug','Ouled Chebel','Ouled Slama','Ouled Yaïch','Souhane','Soumaa'],
    '10': ['Aghbalou','Ahl El Ksar','Ahnif','Aïn Bessem','Aïn El Hadjar','Aïn Laloui','Aïn Turk','Aït Laziz','Aomar','Ath Mansour','Bechloul','Bir Ghbalou','Bordj Okhriss','Bouderbala','Bouira','Boukram','Chorfa','Dechmia','Dirrah','Djebahia','El Adjiba','El Asnam','El Hachimia','El Hakimia','El Khabouzia','El Mokrani','Guerrouma','Hadjera Zerga','Haizer','Kadiria','Lakhdaria','M\'Chedallah','Maala','Maamora','Mezdour','Oued El Berdi','Ouled Rached','Raouraoua','Ridane','Saharidj','Souk El Khemis','Sour El Ghozlane','Taghzout','Taguedit','Zbarbar'],
    '11': ['Abalessa','Idles','In Amguel','Tamanrasset','Tazrouk'],
    '12': ['Aïn Zerga','Bedjene','Bekkaria','Bir Dheb','Bir el-Ater','Bir Mokkadem','Boukhadra','Boulhaf Dir','Cheria','El Aouinet','El Houidjbet','El Kouif','El Ma Labiodh','El Meridj','El Mezeraa','El Ogla','El Ogla Malha','Ferkane','Guorriguer','Hammamet','Morsott','Negrine','Ouenza','Oum Ali','Safsaf El Ouesra','Stah Guentis','Tébessa','Tlidjene'],
    '13': ['Aïn Fetah','Aïn Fezza','Aïn Ghoraba','Aïn Kebira','Aïn Nehala','Aïn Tallout','Aïn Youcef','Akid Abbes','Amieur','Azaïls','Bab El Assa','Beni Bahdel','Beni Boussaïd','Beni Khellad','Beni Mester','Beni Ouarsous','Beni Smiel','Beni Snous','Bensekrane','Bouhlou','Chetouane','Dar Yaghmoracen','Djebala','El Aricha','El Bouihi','El Fehoul','El Gor','Fellaoucene','Ghazaouet','Hammam Boughrara','Hennaya','Honaine','Maghnia','Mansourah','Marsa Ben M\'Hidi','M\'Sirda Fouaga','Nedroma','Oued Lakhdar','Ouled Mimoun','Ouled Riyah','Remchi','Sabra','Sebaa Chioukh','Sebdou','Sidi Abdelli','Sidi Djilali','Sidi Medjahed','Souahlia','Souani','Souk Tleta','Terny Beni Hdiel','Tianet','Tlemcen','Zenata'],
    '14': ['Aïn Bouchekif','Aïn Deheb','Aïn El Hadid','Aïn Kermes','Aïn Zarit','Bougara','Chehaima','Dahmouni','Djebilet Rosfa','Djillali Ben Amar','Faidja','Frenda','Guertoufa','Hamadia','Ksar Chellala','Madna','Mahdia','Mechraa Sfa','Medrissa','Medroussa','Meghila','Mellakou','Nadorah','Naima','Oued Lili','Rahouia','Rechaïga','Sebt','Sebaine','Serghine','Si Abdelghani','Sidi Abderrahmane','Sidi Ali Mellal','Sidi Bakhti','Sidi Hosni','Sougueur','Tagdempt','Takhemaret','Tiaret','Tidda','Tousnina','Zmalet El Emir Abdelkader'],
    '15': ['Abi Youcef','Aghribs','Agouni Gueghrane','Aïn El Hammam','Aïn Zaouia','Aït Aggouacha','Aït Aïssa Mimoun','Aït Bouaddou','Aït Boumahdi','Aït Chafâa','Aït Khellili','Aït Mahmoud','Aït Ouacif','Aït Oumalou','Aït Toudert','Aït Yahia','Aït Yahia Moussa','Aït Yenni','Aït Zmenzer','Akbil','Akerrou','Assi Youcef','Ath Zikki','Azazga','Azeffoun','Beni Aïssi','Beni Douala','Boghni','Boudjima','Bounouh','Bouzeguène','Draâ Ben Khedda','Draâ El Mizan','Freha','Frikat','Iboudraren','Idjeur','Iferhounène','Ifigha','Iflissen','Illilten','Illoula Oumalou','Imsouhal','Irdjen','Larbaâ Nath Irathen','Mâatkas','Makouda','Mechtras','Mekla','Mizrana','M\'Kira','Ouacif','Ouadhia','Ouaguenoun','Sidi Namane','Souamaâ','Souk El Thenine','Tadmaït','Tigzirt','Timizart','Tirmitine','Tizi Gheniff','Tizi N\'Tleta','Tizi Ouzou','Tizi Rached','Yakouren','Yatafen','Zekri'],
    '16': ['Aïn Benian','Aïn Taya','Alger-Centre','Bab El Oued','Bab Ezzouar','Baba Hassen','Bachdjerrah','Baraki','Belouizdad','Ben Aknoun','Beni Messous','Bir Mourad Raïs','Birkhadem','Birtouta','Bologhine','Bordj El Bahri','Bordj El Kiffan','Bourouba','Bouzareah','Casbah','Chéraga','Dar El Beïda','Dely Ibrahim','Djasr Kasentina','Douira','Draria','El Achour','El Biar','El Hammamet','El Harrach','El Magharia','El Marsa','Hraoua','Hussein Dey','Hydra','Khraissia','Kouba','Les Eucalyptus','Mahelma','Mohammadia','Oued Koriche','Oued Smar','Ouled Chebel','Ouled Fayet','Rahmania','Raïs Hamidou','Rouïba','Saoula','Sidi Abdellah','Sidi Moussa','Staoueli','Tessala El Merdja'],
    '17': ['Aïn Chouhada','Aïn El Ibel','Aïn Feka','Aïn Maabed','Aïn Oussera','Amourah','Benhar','Beni Yagoub','Birine','Bouira Lahdab','Charef','Dar Chioukh','Deldoul','Djelfa','Douis','El Guedid','El Idrissia','El Khemis','Faidh El Botma','Guernini','Guettara','Had Sahary','Hassi Bahbah','Hassi El Euch','Hassi Fedoul','M\'Liliha','Messaad','Moudjebara','Oum Laadham','Sed Rahal','Selmana','Sidi Baizid','Sidi Laadjel','Taadmit','Zaafrane','Zaccar'],
    '18': ['Bordj Tahar','Boucif Ouled Askeur','Boudriaa Ben Yadjis','Bouraoui Belhadef','Chahna','Chekfa','Djemaa Beni Habibi','Djimla','El Ancer','El Aouana','El Kennar Nouchfi','El Milia','Emir Abdelkader','Erraguene Souissi','Ghebala','Jijel','Kaous','Kheiri Oued Adjoul','Oudjana','Ouled Rabah','Ouled Yahia Khadrouch','Selma Benziada','Settara','Sidi Abdelaziz','Sidi Marouf','Taher','Texenna','Ziama Mansouriah'],
    '19': ['Aïn Abessa','Aïn Arnat','Aïn Azel','Aïn El Kebira','Aïn Lahdjar','Aïn Legradj','Aïn Oulmene','Aïn Roua','Aïn Sebt','Aït Naoual Mezada','Aït Tizi','Amoucha','Babor','Bazer Sakhra','Beidha Bordj','Belaa','Beni Aziz','Beni Chebana','Beni Fouda','Beni Hocine','Beni Mouhli','Beni Ourtilane','Beni Oussine','Bir El Arch','Bir Haddada','Bouandas','Bougaa','Bousselam','Boutaleb','Dehamcha','Djemila','Draa Kebila','El Eulma','El Ouldja','El Ouricia','Guellal','Guelta Zerka','Guenzet','Guidjel','Hamma','Hammam Guergour','Hammam Soukhna','Harbil','Ksar El Abtal','Maaouia','Maoklane','Mezloug','Oued El Barad','Ouled Addouane','Ouled Sabor','Ouled Si Ahmed','Ouled Tebben','Rasfa','Salah Bey','Serdj El Ghoul','Sétif','Tachouda','Talaifacene','Taya','Tella','Tizi N\'Bechar'],
    '20': ['Aïn El Hadjar','Aïn Sekhouna','Aïn Soltane','Doui Thabet','El Hassasna','Hounet','Maamora','Moulay Larbi','Ouled Brahim','Ouled Khaled','Saïda','Sidi Ahmed','Sidi Amar','Sidi Boubekeur','Tircine','Youb'],
    '21': ['Aïn Bouziane','Aïn Charchar','Aïn Kechra','Aïn Zouit','Azzaba','Bekkouche Lakhdar','Ben Azzouz','Beni Bechir','Beni Oulbane','Beni Zid','Bin El Ouiden','Bouchtata','Cheraia','Collo','Djendel Saadi Mohamed','El Ghedir','El Hadaiek','El Harrouch','El Marsa','Emdjez Edchich','Es Sebt','Filfila','Hamadi Krouma','Kanoua','Kerkera','Kheneg Mayoum','Oued Zehour','Ouldja Boulballout','Ouled Attia','Ouled Hbaba','Oum Toub','Ramdane Djamel','Salah Bouchaour','Sidi Mezghiche','Skikda','Tamalous','Zerdazas','Zitouna'],
    '22': ['Aïn Adden','Aïn El Berd','Aïn Kada','Aïn Thrid','Aïn Tindamine','Amarnas','Badredine El Mokrani','Belarbi','Ben Badis','Benachiba Chelia','Bir El Hammam','Boudjebaa El Bordj','Boukhanafis','Dhaya','El Haçaiba','Hassi Dahou','Hassi Zahana','Lamtar','M\'Cid','Makedra','Marhoum','Merine','Mezaourou','Mostefa Ben Brahim','Moulay Slissen','Oued Sebaa','Oued Sefioune','Oued Taourira','Ras El Ma','Redjem Demouche','Sehala Thaoura','Sfisef','Sidi Ali Benyoub','Sidi Ali Boussidi','Sidi Bel Abbès','Sidi Brahim','Sidi Chaib','Sidi Daho des Zairs','Sidi Hamadouche','Sidi Khaled','Sidi Lahcene','Sidi Yacoub','Tabia','Tafessour','Taoudmout','Teghalimet','Telagh','Tenira','Tessala','Tilmouni','Zerouala'],
    '23': ['Aïn Berda','Annaba','Berrahal','Chetaïbi','Cheurfa','El Bouni','El Eulma','El Hadjar','Oued El Aneb','Seraïdi','Sidi Amar','Treat'],
    '24': ['Aïn Ben Beida','Aïn Hessainia','Aïn Larbi','Aïn Makhlouf','Aïn Reggada','Aïn Sandel','Belkheir','Ben Djerrah','Beni Mezline','Bordj Sabath','Bouati Mahmoud','Bouchegouf','Bouhachana','Bouhamdane','Boumahra Ahmed','Dahouara','Djeballah Khemissi','El Fedjoudj','Guelaat Bou Sbaa','Guelma','Hammam Debagh','Hammam N\'Bail','Héliopolis','Houari Boumédiène','Khezarra','Medjez Amar','Medjez Sfa','Nechmaya','Oued Cheham','Oued Fragha','Oued Zenati','Ras El Agba','Roknia','Sellaoua Announa','Tamlouka'],
    '25': ['Aïn Abid','Aïn Smara','Ben Badis','Beni Hamidane','Constantine','Didouche Mourad','El Khroub','Hamma Bouziane','Ibn Ziad','Messaoud Boudjeriou','Ouled Rahmoune','Zighoud Youcef'],
    '26': ['Ahl Chaaba','Aïn Boucif','Aïn Ouksir','Aïssaouia','Aziz','Baata','Benchicao','Beni Slimane','Berrouaghia','Bir Ben Laabed','Boghar','Bouaiche','Bouaichoune','Bouchrahil','Boughzoul','Chahbounia','Chellalet El Adhaoura','Cheniguel','Derrag','Deux Bassins','Djouab','Draa Essamar','El Azizia','El Hamdania','El Omaria','El Ouinet','Hannacha','Khams Djouamaa','Ksar El Boukhari','Médéa','Medjebar','Meghraoua','Mihoub','Ouamri','Oued Harbil','Ouled Bouachra','Ouled Brahim','Ouled Hellal','Oum El Djalil','Ouzera','Rebaia','Saneg','Sedraia','Seghouane','Si Mahdjoub','Sidi Damed','Sidi Errabia','Sidi Naamane','Sidi Zahar','Sidi Ziane','Tablat','Tafraout','Tamesguida','Tizi Mahdi','Zoubiria'],
    '27': ['Abdelmalek Ramdane','Achaacha','Aïn Boudinar','Aïn Nouissy','Aïn Sidi Cherif','Aïn Tedles','Blad Touahria','Bouguirat','El Hassiane','Fornaka','Hadjadj','Hassi Mameche','Khadra','Kheireddine','Mansourah','Mazagran','Mesra','Mostaganem','Nekmaria','Oued El Kheir','Ouled Boughalem','Ouled Maallah','Safsaf','Sayada','Sidi Ali','Sidi Belattar','Sidi Lakhdar','Sirat','Souaflia','Stidia','Tazgait','Touahria'],
    '28': ['Aïn El Hadjel','Aïn El Melh','Aïn Khadra','Aïn Rich','Belaiba','Ben Srour','Beni Ilmane','Berhoum','Bir Foda','Bou Saâda','Bouti Sayah','Chellal','Dehahna','El Hamel','El Houamed','Hammam Dhalaa','Khaltam','Khettouti Sed El Djir','Khoubana','M\'Sila','M\'Tarfa','Maadid','Maarif','Magra','Medjedel','Menaa','Ouanougha','Ouled Addi Guebala','Ouled Atia','Ouled Derradj','Ouled Madhi','Ouled Mansour','Ouled Sidi Brahim','Ouled Slimane','Oulttem','Sidi Aïssa','Sidi Ameur','Sidi Hadjeres','Sidi M\'Hamed','Slim','Souamaa','Tarmount','Zarzour'],
    '29': ['Aïn Fares','Aïn Fekan','Aïn Ferah','Aïn Fras','Alaïmia','Aouf','Beniane','Bou Hanifia','Bou Henni','Chorfa','El Bordj','El Gaada','El Ghomri','El Guettana','El Keurt','El Menaouer','Ferraguig','Froha','Gharrous','Guerdjoum','Ghriss','Hachem','Hacine','Khalouia','Makdha','Mamounia','Maoussa','Mascara','Matemore','Mocta Douz','Mohammadia','Nesmoth','Oggaz','Oued El Abtal','Oued Taria','Ras El Aïn Amirouche','Sedjerara','Sehailia','Sidi Abdeldjebar','Sidi Abdelmoumen','Sidi Boussaid','Sidi Kada','Sig','Tighennif','Tizi','Zahana'],
    '30': ['Aïn Beida','El Borma','Hassi Ben Abdellah','Hassi Messaoud','N\'Goussa','Ouargla','Rouissat','Sidi Khouiled'],
    '31': ['Aïn El Turk','Aïn Bia','Arzew','Benfreha','Bethioua','Bir El Djir','Boufatis','Bousfer','Boutlélis','El Ançor','El Braya','El Kerma','Es Senia','Gdyel','Hassi Ben Okba','Hassi Bounif','Hassi Mefsoukh','Mers El Hadjadj','Mers El Kébir','Misserghin','Oran','Oued Tlelat','Sidi Benyebka','Sidi Chami','Tafraoui'],
    '32': ['Aïn El Orak','Arbaouat','Boualem','Bougtob','Boussemghoun','Brezina','Chellala','Cheguig','El Abiodh Sidi Cheikh','El Bayadh','El Bnoud','El Kheiter','El Mehara','Ghassoul','Kef El Ahmar','Kraakda','Rogassa','Sidi Ameur','Sidi Slimane','Sidi Tifour','Stitten','Tousmouline'],
    '33': ['Bordj Omar Driss','Debdeb','Illizi','In Amenas'],
    '34': ['Aïn Soltane','Aïn Taghrout','Aïn Tesra','Belimour','Ben Daoud','Bir Kasdali','Bordj Bou Arreridj','Bordj Ghedir','Bordj Zemoura','Colla','Djaafra','El Achir','El Anasser','El Euch','El Hammadia','El M\'hir','El Main','Ghilassa','Haraza','Hasnaoua','Khelil','Ksour','Mansoura','Medjana','Ouled Brahem','Ouled Dahmane','Ouled Sidi Brahim','Rabta','Ras El Oued','Sidi Embarek','Taglait','Tassamert','Tefreg','Thniet Enasser'],
    '35': ['Afir','Ammal','Baghlia','Ben Choud','Béni Amrane','Bordj Menaïel','Boudouaou','Boudouaou El Bahri','Boumerdès','Bouzegza Keddara','Chabet El Ameur','Corso','Dellys','Djinet','El Kharrouba','Hammadi','Isser','Khemis El Khechna','Larbatache','Leghata','Naciria','Ouled Aïssa','Ouled Hedadj','Ouled Moussa','Si Mustapha','Sidi Daoud','Souk El Had','Taourga','Thénia','Tidjelabine','Timezrit','Zemmouri'],
    '36': ['Aïn El Assel','Aïn Kerma','Asfour','Ben M\'hidi','Berrihane','Besbes','Bougous','Bouhadjar','Bouteldja','Chebaita Mokhtar','Chefia','Chihani','Dréan','Echatt','El Aioun','El Kala','El Tarf','Hammam Beni Salah','Lac des Oiseaux','Oued Zitoun','Raml Souk','Souarekh','Zerizer','Zitouna'],
    '37': ['Oum El Assel','Tindouf'],
    '38': ['Ammari','Beni Chaib','Beni Lahcene','Bordj Bou Naama','Bordj El Emir Abdelkader','Boucaid','Khemisti','Larbaa','Lardjem','Layoune','Lazharia','Maacem','Melaab','Ouled Bessam','Sidi Abed','Sidi Boutouchent','Sidi Lantri','Tamellahat','Theniet El Had','Tissemsilt','Youssoufia'],
    '39': ['Bayadha','Ben Guecha','Debila','Douar El Maa','El Oued','El Ogla','Hamraia','Hassani Abdelkrelim','Hassi Khalifa','Kouinine','Magrane','Mih Ouensa','Nakhla','Oued El Alenda','Ourmes','Reguiba','Robbah','Sidi Aoun','Taghzout','Taleb Larbi','Trifaoui'],
    '40': ['Aïn Touila','Babar','Baghaï','Bouhmama','Chechar','Chélia','Djellal','El Hamma','El Mahmal','El Oueldja','Ensigha','Kaïs','Khenchela','Khirane','M\'Sara','M\'Toussa','Ouled Rechache','Remila','Tamza','Taouzianat','Yabous'],
    '41': ['Aïn Soltane','Aïn Zana','Bir Bouhouche','Drea','Hanencha','Heddada','Khedara','Khemissa','M\'daourouche','Machroha','Merahna','Oued Keberit','Ouillen','Ouled Driss','Ouled Moumen','Oum El Adhaim','Ragouba','Safel El Ouidene','Sedrata','Sidi Fredj','Souk Ahras','Taoura','Terraguelt','Tiffech','Zaarouria','Zouabi'],
    '42': ['Aghbal','Ahmar El Aïn','Aïn Tagourait','Attatba','Beni Milleuk','Bou Ismaïl','Bouharoun','Bourkika','Chaiba','Cherchell','Damous','Douaouda','Fouka','Gouraya','Hadjeret Ennous','Hadjout','Khemisti','Koléa','Larhat','Menaceur','Merad','Messelmoun','Nador','Sidi Amar','Sidi Ghiles','Sidi Rached','Sidi Semiane','Tipaza'],
    '43': ['Ahmed Rachedi','Aïn Beida Harriche','Aïn Mellouk','Aïn Tine','Amira Arrès','Benyahia Abderrahmane','Bouhatem','Chelghoum Laïd','Chigara','Derrahi Bousselah','El Mechira','Elayadi Barbes','Ferdjioua','Grarem Gouga','Hamala','Mila','Minar Zarza','Oued Athmania','Oued Endja','Oued Seguen','Ouled Khalouf','Rouached','Sidi Khelifa','Sidi Mérouane','Tadjenanet','Tassadane Haddada','Teleghma','Terrai Bainen','Tessala Lemtaï','Tiberguent','Yahia Beni Guecha','Zeghaia'],
    '44': ['Aïn Benian','Aïn Bouihi','Aïn Defla','Aïn Lechiekh','Aïn Soltane','Aïn Torki','Arib','Bathia','Belaas','Ben Allal','Bir Ould Khelifa','Birbouche','Bordj Emir Khaled','Boumedfaa','Bourached','Djelida','Djemaa Ouled Cheikh','Djendel','El Abadia','El Amra','El Attaf','El Hassania','El Maine','Hammam Righa','Hoceinia','Khemis Miliana','Mekhatria','Miliana','Oued Chorfa','Oued Djemaa','Rouina','Sidi Lakhdar','Tacheta Zougagha','Tarik Ibn Ziad','Tiberkanine','Zeddine'],
    '45': ['Aïn Ben Khelil','Aïn Sefra','Asla','Djeniene Bourezg','El Biod','Kasdir','Makmen Ben Amar','Mecheria','Moghrar','Naâma','Sfissifa','Tiout'],
    '46': ['Aghlal','Aïn El Arbaa','Aïn Kihal','Aïn Témouchent','Aïn Tolba','Aoubellil','Beni Saf','Bouzedjar','Chaabat El Leham','Chentouf','El Amria','El Emir Abdelkader','El Malah','El Messaid','Hammam Bouhadjar','Hassasna','Hassi El Ghella','Oued Berkeche','Oued Sabah','Ouled Boudjemaa','Ouled Kihal','Oulhaça El Gheraba','Sidi Ben Adda','Sidi Boumedienne','Sidi Ouriache','Sidi Safi','Tamzoura','Terga'],
    '47': ['Berriane','Bounoura','Dhayet Bendhahoua','El Atteuf','El Guerrara','Ghardaïa','Mansoura','Metlili','Sebseb'],
    '48': ['Aïn Rahma','Aïn Tarek','Ammi Moussa','Belassel Bouzegza','Bendaoud','Beni Dergoun','Beni Zentis','Dar Ben Abdellah','Djidiouia','El Guettar','El Hamadna','El Hassi','El Matmar','El Ouldja','Had Echkalla','Hamri','Kalaa','Lahlef','Mazouna','Mediouna','Mendes','Merdja Sidi Abed','Ouarizane','Oued El Djemaa','Oued Essalem','Oued Rhiou','Ouled Aiche','Ouled Sidi Mihoub','Ramka','Relizane','Sidi Khettab','Sidi Lazreg','Sidi M\'Hamed Ben Ali','Sidi M\'Hamed Benaouda','Sidi Saada','Souk El Had','Yellel','Zemmoura'],
    '49': ['Aougrout','Charouine','Deldoul','Ksar Kaddour','Metarfa','Ouled Aïssa','Ouled Saïd','Talmine','Timimoun','Tinerkouk'],
    '50': ['Bordj Badji Mokhtar','Timiaouine'],
    '51': ['Besbes','Doucen','Ech Chaïba','Ouled Djellal','Ras El Miaad','Sidi Khaled'],
    '52': ['Béni Abbès','Béni Ikhlef','El Ouata','Igli','Kerzaz','Ksabi','Ouled Khodeir','Tabelbala','Tamtert','Timoudi'],
    '53': ['Foggaret Ezzaouia','In Ghar','In Salah'],
    '54': ['In Guezzam','Tin Zaouatine'],
    '55': ['Benaceur','Blidet Amor','El Allia','El Hadjira','Megarine','M\'Naguer','Nezla','Sidi Slimane','Taibet','Tebesbest','Temacine','Touggourt','Zaouia El Abidia'],
    '56': ['Bordj El Haouas','Djanet'],
    '57': ['Djamaa','El M\'Ghair','M\'Rara','Oum Touyour','Sidi Amrane','Sidi Khellil','Still','Tendla'],
    '58': ['El Meniaa','Hassi Fehal','Hassi Gara']
  };

  // ─── Public API ─────────────────────────────────────────────────
  return {
    wilayas: wilayas,
    communes: communes,

    /** Get all wilayas sorted by code */
    getWilayas: function () {
      return wilayas.slice().sort(function (a, b) {
        return a.code.localeCompare(b.code);
      });
    },

    /** Get communes for a given wilaya code */
    getCommunes: function (wilayaCode) {
      var code = String(wilayaCode).padStart(2, '0');
      return (communes[code] || []).slice().sort();
    },

    /** Get wilaya object by code */
    getWilayaByCode: function (code) {
      var padded = String(code).padStart(2, '0');
      return wilayas.find(function (w) { return w.code === padded; }) || null;
    },

    /** Get wilaya name by code */
    getWilayaName: function (code) {
      var w = this.getWilayaByCode(code);
      return w ? w.name : '';
    },

    /** Get formatted display: "16 - Alger" */
    getWilayaDisplay: function (code) {
      var w = this.getWilayaByCode(code);
      return w ? w.code + ' - ' + w.name : '';
    }
  };
})();
