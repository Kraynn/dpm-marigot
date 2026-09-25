/**
 * DPM Marigot — Politique de confidentialité.
 *
 * Écrite à partir du parcours réel des données, relevé dans le code le
 * 25/09/2026, pas d'un modèle générique :
 *   ContactSection → /api/trpc/contact.sendQuote (server/routers.ts)
 *   → forwardToAsapDevis (server/_core/asapDevis.ts) → asap-devis-api /api/lead
 *   → fiche PDF + envoi Resend à l'artisan + accusé au client
 *   → enregistrerLead → Supabase, table `leads` (région eu-west-3, Paris).
 *
 * Section 7, état au 26/09/2026 — À LIRE AVANT DE LA MODIFIER.
 *
 * Mesuré sur la production le 25/09 : le site lui-même ne pose aucun cookie,
 * localStorage et sessionStorage restent vides. En revanche la carte de la page
 * d'accueil est repassée en chargement automatique (arbitrage d'Anthony du
 * 26/09, cf. MapSection.tsx) : la page contacte donc un tiers dès son ouverture,
 * et lui transmet l'adresse IP du visiteur sans action de sa part.
 *
 * La section 7 a été reformulée en conséquence, et elle est volontairement
 * générique : elle ne nomme plus le fournisseur de la carte, sur demande
 * d'Anthony. Elle dit en revanche que des contenus tiers sont chargés, qu'ils
 * reçoivent l'adresse IP et qu'ils peuvent poser leurs propres cookies — ce qui
 * est vrai et vérifiable.
 *
 * NE PAS y rétablir « ce site ne dépose aucun cookie » sans qualificatif, ni
 * « aucune donnée n'est envoyée sans votre action » : les deux étaient exacts
 * tant que la carte était derrière un clic, et sont devenus faux depuis.
 *
 * Créé le 25/09/2026.
 */
import PageLegale from "@/components/PageLegale";
import { DPM, EDITEUR_TECHNIQUE } from "@/identite-legale";

export default function Confidentialite() {
  return (
    <PageLegale
      titre="Politique de confidentialité"
      intro="Ce que devient une demande envoyée depuis ce site : qui la reçoit, où elle est conservée, combien de temps, et comment la faire supprimer."
    >
      <h2>1. Qui est responsable</h2>
      <p>
        Les données que vous transmettez par le formulaire de ce site sont traitées sous la
        responsabilité de <strong>{DPM.nomCommercial}</strong>, {DPM.adresse} —{" "}
        <a href={`mailto:${DPM.email}`}>{DPM.email}</a>.
      </p>
      <p>
        {EDITEUR_TECHNIQUE.nomCommercial}, qui conçoit et exploite ce site, intervient comme{" "}
        <strong>sous-traitant</strong> : elle traite ces données pour le compte de{" "}
        {DPM.nomCommercial} et uniquement sur ses instructions.
      </p>

      <h2>2. Quelles données, et pourquoi</h2>
      <p>
        Le formulaire ne collecte que ce qui sert à vous répondre. Rien n'est demandé
        « au cas où ».
      </p>
      <div className="tableau">
        <table>
          <thead>
            <tr>
              <th>Donnée</th>
              <th>Obligatoire</th>
              <th>À quoi elle sert</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Nom</td>
              <td>Oui</td>
              <td>Vous identifier et vous nommer dans la réponse</td>
            </tr>
            <tr>
              <td>Téléphone</td>
              <td>Oui</td>
              <td>Vous rappeler — c'est le moyen de réponse principal</td>
            </tr>
            <tr>
              <td>E-mail</td>
              <td>Non</td>
              <td>Vous envoyer un accusé de réception et, si vous préférez, répondre par écrit</td>
            </tr>
            <tr>
              <td>Type de projet</td>
              <td>Oui</td>
              <td>Orienter la demande vers le bon métier</td>
            </tr>
            <tr>
              <td>Message libre</td>
              <td>Non</td>
              <td>Décrire le chantier ; son contenu dépend entièrement de vous</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        <strong>Finalité :</strong> répondre à votre demande et, le cas échéant, établir un
        devis.
      </p>
      <p>
        <strong>Base légale :</strong> l'exécution de mesures précontractuelles prises à votre
        demande (article 6.1.b du RGPD). Ce n'est pas votre consentement : vous n'avez donc pas
        de case à cocher, et retirer un consentement qui n'existe pas n'aurait aucun sens. En
        revanche, vous pouvez à tout moment demander l'effacement de votre demande (section 6).
      </p>
      <p>
        Vos données ne sont <strong>jamais</strong> utilisées pour de la prospection, ni
        vendues, ni cédées à un tiers à des fins commerciales.
      </p>

      <h2>3. Le trajet exact de votre demande</h2>
      <p>Quand vous cliquez sur « Envoyer ma demande » :</p>
      <ul>
        <li>
          la demande est reçue par une fonction hébergée chez <strong>Vercel</strong>, qui sert
          ce site ;
        </li>
        <li>
          elle est transmise au service de traitement des demandes exploité par{" "}
          {EDITEUR_TECHNIQUE.nomCommercial}, également hébergé chez Vercel ;
        </li>
        <li>
          ce service met votre demande en forme dans une fiche PDF et l'envoie à{" "}
          {DPM.nomCommercial} par e-mail, via <strong>Resend</strong>. Si vous avez indiqué une
          adresse e-mail, elle est utilisée comme adresse de réponse et vous recevez un accusé
          de réception ;
        </li>
        <li>
          une copie de la demande est enregistrée dans une base de données{" "}
          <strong>Supabase</strong> hébergée <strong>à Paris (région eu-west-3)</strong>. Cet
          enregistrement n'a qu'un rôle : garder une trace de votre demande si l'envoi de
          l'e-mail échoue, pour qu'elle ne soit pas perdue.
        </li>
      </ul>
      <p>
        Vercel et Resend sont des sociétés établies aux États-Unis ; les transferts hors Union
        européenne qu'elles impliquent sont encadrés par les{" "}
        <strong>clauses contractuelles types</strong> de la Commission européenne. Les données
        enregistrées en base, elles, sont stockées à Paris.
      </p>

      <h2>4. Combien de temps</h2>
      <div className="tableau">
        <table>
          <thead>
            <tr>
              <th>Où</th>
              <th>Durée</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Copie technique en base de données</td>
              <td>12 mois à compter de la réception de la demande</td>
            </tr>
            <tr>
              <td>E-mail reçu par {DPM.nomCommercial}, demande sans suite</td>
              <td>3 ans à compter du dernier contact</td>
            </tr>
            <tr>
              <td>E-mail reçu par {DPM.nomCommercial}, demande devenue un chantier</td>
              <td>
                Durée de la relation commerciale, puis le temps imposé par les obligations
                comptables et de garantie
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>5. Qui y a accès</h2>
      <ul>
        <li>{DPM.nomCommercial}, destinataire de votre demande ;</li>
        <li>
          {EDITEUR_TECHNIQUE.nomCommercial}, pour exploiter et dépanner le site, dans la seule
          mesure nécessaire ;
        </li>
        <li>
          les prestataires techniques cités en section 3 — Vercel (hébergement), Supabase (base
          de données), Resend (envoi des e-mails) — qui agissent comme sous-traitants et n'ont
          pas le droit d'utiliser vos données pour leur propre compte.
        </li>
      </ul>

      <h2>6. Vos droits</h2>
      <p>
        Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, et
        d'un droit d'opposition. Vous pouvez aussi demander une copie de vos données dans un
        format lisible.
      </p>
      <div className="encadre">
        <p>
          <strong>Pour exercer un droit</strong>, écrivez à{" "}
          <a href={`mailto:${DPM.email}`}>{DPM.email}</a> en indiquant le nom et le numéro de
          téléphone utilisés lors de votre demande.
        </p>
        <p>
          Une demande d'effacement porte sur <strong>les deux</strong> copies : la ligne
          enregistrée en base de données et l'e-mail reçu par {DPM.nomCommercial}. Les deux sont
          supprimées.
        </p>
      </div>
      <p>
        Si la réponse ne vous convient pas, vous pouvez saisir la{" "}
        <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer">
          Commission nationale de l'informatique et des libertés (CNIL)
        </a>
        .
      </p>

      <h2>7. Cookies et traceurs</h2>
      <div className="encadre">
        <p>
          <strong>Ce site ne dépose aucun cookie de son fait</strong> et n'écrit rien dans la
          mémoire de votre navigateur. Il n'y a ni mesure d'audience, ni pixel publicitaire, ni
          bouton de réseau social traçant : nous ne suivons pas votre navigation.
        </p>
      </div>
      <p>
        Certaines ressources de la page — polices de caractères, contenus intégrés — sont
        servies par des prestataires tiers. Les afficher suppose que votre navigateur les
        contacte, ce qui leur transmet votre adresse IP, et ces prestataires peuvent appliquer
        leurs propres règles en matière de cookies. Vous pouvez vous y opposer par les réglages
        de votre navigateur.
      </p>

      <h2>8. Sécurité</h2>
      <p>
        Les échanges avec ce site sont chiffrés (HTTPS). L'accès à la base de données est
        restreint au service qui l'alimente. Le formulaire est protégé contre les envois
        automatisés par un champ piège, qui n'est ni lu ni conservé lorsqu'il déclenche.
      </p>

      <h2>9. Modifications</h2>
      <p>
        Cette politique peut être mise à jour si le fonctionnement du site change. La date de
        version figure en haut de page.
      </p>
    </PageLegale>
  );
}
