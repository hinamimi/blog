/** @jsxImportSource https://esm.sh/react@19.0.0 */
import { Link } from "react-router-dom";

export default function post_20250223() {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header>
        <Link to="/blog">Home</Link>
      </header>
      <h1 style={{ borderBottom: "2px solid #333", paddingBottom: "10px" }}>
        GitHub Pagesでブログを書く環境を構築した
      </h1>

      <h2 style={{ color: "#555" }}>なんでブログを書こうと思ったのか</h2>
      <p>
        人間はすべからくブログを書くべきである！これは宇宙の真理だ。いや、まあ、そこまで大げさな話ではないけど、ブログを書くことには色々とメリットがある。
      </p>
      <p>
        なぜ人間はブログを書くべきなのかについては、真に驚くべき説明を思いついたのだが、ここに記すには余白が狭すぎる。嘘です、そのうち書きます。
      </p>
      <p>
        ともあれ、自分の考えを整理するためにも、知見をシェアするためにも、ブログを書くのは良いことだ。そういうわけで、今回ブログを書く環境を整えてみた。
      </p>

      <h2 style={{ color: "#555" }}>環境構築するまでの意思決定</h2>
      <p>
        環境構築には色々な選択肢があったが、最終的に以下のような構成にした。
      </p>

      <ul>
        <li>
          <strong>Deno + React + React Router</strong> で構築
          <ul>
            <li>
              職場ではNode.jsを使っているので、せっかくだからDenoを試したかった。
            </li>
            <li>
              フロントエンドのデファクトスタンダードはReactなので、やっぱりこれを選択。
            </li>
            <li>
              Next.jsは個人的にあまり好きじゃない（アンチというほどでもないが）、それに他のフレームワークを触ったことがなかったので、React
              Routerを採用。
            </li>
          </ul>
        </li>
        <li>
          <strong>お金を払いたくないのでGitHub Pagesを利用</strong>
          <ul>
            <li>独自ドメインは維持コストがめんどくさい。</li>
            <li>
              Cloudflare
              Pagesも考えたけど、QiitaやZennの記事を読んでいて、最初に解像度が上がったのがGitHub
              Pagesだった。
            </li>
            <li>まあ、無料で運用できるならそれに越したことはない。</li>
          </ul>
        </li>
      </ul>

      <h2 style={{ color: "#555" }}>環境構築するまで</h2>
      <p>最近はLLM（大規模言語モデル）を活用すると、環境構築が爆速になる。</p>

      <ul>
        <li>
          <strong>Claude 3にファイル構成を提案させた</strong>
        </li>
      </ul>
      <p>これがなかなか良い感じで、手作業で考えるよりも楽だった。</p>
      <img
        src="/static/2025-02-23/claude3-start.png"
        alt="Claude 3の提案"
        style={{ maxWidth: "100%" }}
      />
      <ul>
        <li>
          <strong>とりあえず動くまでのテンプレコードをAIに書かせた</strong>
          <ul>
            <li>ChatGPTやGitHub Copilotも駆使。</li>
            <li>
              Claudeにはメインの流れを考えさせ、Copilotにはエラー修正や細かい説明をさせる。
              <ul>
                <li>
                  こうすることで、Claudeに逐一コンテキストを説明しなくて済むので効率的。
                </li>
                <li>
                  ただし、Copilotは使いこなせなかったので、最終的にChatGPTに助けを求めた。
                  <ul>
                    <li>AIエージェントをうまく扱うのは意外と難しい。</li>
                    <li>
                      最新技術についていけなくなっている気がして、少し焦る……。
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>

      <h2 style={{ color: "#555" }}>ブログを書くまで</h2>
      <p>さて、環境構築が終わったので、いよいよブログを書く。</p>

      <ul>
        <li>マークダウンで下書きを作成。</li>
        <li>それをLLM（ChatGPTなど）に要約・整理してもらう。</li>
        <li>最後に自分で校正。</li>
      </ul>

      <p>こんな感じで書いてみることにした。</p>
      <p>
        技術ブログをアウトプットすることで、自分の理解も深まり、他の人にも役立つ情報が届けられるはずだ。果たしてこの方法がうまく機能するのかは、今後の運用次第。とりあえずは、アウトプットすることが大事！
      </p>
      <hr />
      <footer>
        <p>Posted on February 23, 2025</p>
        <p>後でheader, footer,デザインを整える</p>
      </footer>
    </div>
  );
}
