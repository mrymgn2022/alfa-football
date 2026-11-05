ALFA_Stadium_V5_6_1_packed.glb
- 出所: 自社制作(Blender 4.x / ALFA_Stadium生成スクリプト、glTF Y-up出力)
- ライセンス: 自社アセット(社内制作物、商用利用可)
- スケール: 1 unit = 1m、ピッチ105×68m、原点=ピッチ中心、芝表面 y=0.32
- 軸: 長辺105mがX軸(ゴールライン x=±52.5)、タッチライン z=±34
- 動的スクリーン: AD_TOUCHLINE_NORTH/SOUTH_VIDEO_SURFACE, AD_GOALLINE_EAST/WEST_VIDEO_SURFACE,
  Scoreboard_Screen_1 / Scoreboard_Screen_-1 (V5.3で単一クアッド0..1 UV・屋根縁 x=±92.5へ修正済み)
- アンカー: ANCHOR_BROADCAST=(-7,40.5,90)(V5.3で屋根下ガントリーへ修正) / ANCHOR_PLAYER_TUNNEL_HOME/AWAY
- 同梱ボール: BALL_ROOT(直径0.22m。アプリ側Ball3Dが正のため実行時は非表示化)
- 表示条件: 品質「高」のときだけ使用(中・軽はprocedural一式。specs/setpiece-redesign.md §13)。8人制でも「高」ならこのGLBを使い、ピッチ面の上の物(ライン/ゴール/コーナーフラッグ=材質 ALFA_M_White/ALFA_M_GoalNet/ALFA_M_Stone_Light のうちピッチ範囲内のもの)を非表示にして、8人制のライン・ゴール・フラッグをアプリ側(components/SetPiece3D.tsx)で描く
- V5.3の修正: スコアボード単一クアッド化+可視位置化 / 放送アンカー修正 / コーナー・ペナルティ
  アーク追加 / 全マテリアルへPBR定数ベイク(白化解消) / マッチボール追加
- V5.6.1の修正: ゴール内の床に張られていたネット線(38本)を除去(側面/背面/ルーフは維持)
- V5.6の修正: ネットを実形状(後傾ルーフ・底が深い実プロファイル)へ再構築、212メッシュへ増密
- V5.5の修正: ゴール開口をゴールライン直上へ移動(旧16cm後方) / ネットを148メッシュへ高密度化
- V5.4の修正: 全マーキングを芝面+3〜9mmへ降下(旧+6cm) / スポット類を薄い塗装ディスク化 /
  円・アーク類をフラットリボン化 / 縞・wearを芝とほぼ共面化
- 実測: 82.0MB / 1,024メッシュ / 約146万三角形 / 37マテリアル / テクスチャなし
- 配信用の圧縮: gltfpack 1.2 (meshopt/EXT_meshopt_compression) で82.0MB→11.7MB(gzip後1.8MB)。
  再生成手順: ⓪Goal_Wear_1/Goal_Wear_-1のmesh参照を除去(ゴール前の使用感パッチはユーザー指示で
  非表示。Blender側でGoal_Wearオブジェクト自体が削除されたらこの手順は不要) ①ランタイム参照14ノード(AD×4/Scoreboard×2/BALL_ROOT系3/ANCHOR×3/Pitch_Base/
  ALFA_EXPORT_ROOT)以外のノード名を除去 ②gltfpack -cc -kn -ke -vpf -vtf -kv
  (-vpf/-vtf=位置とUVを浮動小数のまま量子化しない: ミリ単位のマーキング高と広告/スコアボードの
  CanvasTexture用UVを無劣化維持。-kv=テクスチャ未参照でもUV属性を保持。-knは名前維持と引き換えに
  メッシュマージ/インスタンシング無効=draw call数は非圧縮と同じ)。
  非圧縮の原本は 3Dモデル/ALFA_Stadium_V5_6_1.glb (リポジトリ外) が正。
