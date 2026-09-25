/**
 * DPM Marigot — Mentions légales.
 *
 * Obligation de l'article 6-III de la LCEN, indépendante du formulaire.
 * Les informations que seule l'entreprise détient (dénomination légale, SIRET,
 * directeur de la publication…) viennent de `@/identite-legale` et s'affichent
 * « information à compléter » tant qu'elles n'ont pas été transmises.
 * Aucune valeur n'est devinée : un SIRET plausible publié ici serait une fausse
 * déclaration.
 *
 * Créé le 25/09/2026.
 */
import PageLegale, { Champ } from "@/components/PageLegale";
import { DPM, EDITEUR_TECHNIQUE, HEBERGEUR } from "@/identite-legale";

export default function MentionsLegales() {
  return (
    <PageLegale
      titre="Mentions légales"
      intro="Qui édite ce site, qui l'héberge, et à qui s'adresser."
    >
      <h2>1. Éditeur du site</h2>
      <p>
        Le site accessible à l'adresse <strong>dpm-marigot.vercel.app</strong> est édité par :
      </p>
      <ul>
        <li>
          Nom commercial : <strong>{DPM.nomCommercial}</strong>
        </li>
        <li>
          Dénomination légale : <Champ valeur={DPM.denominationLegale} />
        </li>
        <li>
          Forme juridique : <Champ valeur={DPM.formeJuridique} />
        </li>
        <li>
          SIRET : <Champ valeur={DPM.siret} />
        </li>
        <li>
          Code APE : <Champ valeur={DPM.ape} />
        </li>
        <li>
          TVA : <Champ valeur={DPM.tva} />
        </li>
        <li>Adresse : {DPM.adresse}</li>
        <li>
          Téléphone : <a href={`tel:${DPM.telephone.replace(/\s/g, "")}`}>{DPM.telephoneAffiche}</a>
        </li>
        <li>
          Adresse e-mail : <a href={`mailto:${DPM.email}`}>{DPM.email}</a>
        </li>
      </ul>

      <h2>2. Directeur de la publication</h2>
      <p>
        <Champ valeur={DPM.directeurPublication} />, joignable à l'adresse e-mail de contact
        indiquée ci-dessus.
      </p>

      <h2>3. Hébergeur</h2>
      <p>Le site est hébergé par :</p>
      <ul>
        <li>Dénomination : {HEBERGEUR.denomination}</li>
        <li>Adresse : {HEBERGEUR.adresse}</li>
        <li>Contact : {HEBERGEUR.contact}</li>
      </ul>

      <h2>4. Conception et maintenance du site</h2>
      <p>
        Le site est conçu et maintenu par <strong>{EDITEUR_TECHNIQUE.nomCommercial}</strong>,{" "}
        {EDITEUR_TECHNIQUE.formeJuridique}, SIRET {EDITEUR_TECHNIQUE.siret}, immatriculé au{" "}
        {EDITEUR_TECHNIQUE.immatriculation} — <a href={`mailto:${EDITEUR_TECHNIQUE.email}`}>{EDITEUR_TECHNIQUE.email}</a>.
      </p>
      <p>
        {EDITEUR_TECHNIQUE.nomCommercial} intervient comme prestataire technique de{" "}
        {DPM.nomCommercial} et, pour les données transmises par le formulaire de contact, comme{" "}
        <strong>sous-traitant</strong> au sens du RGPD. Le détail figure dans la{" "}
        <a href="/confidentialite">politique de confidentialité</a>.
      </p>

      <h2>5. Assurance professionnelle</h2>
      <p>
        Assurance décennale : <Champ valeur={DPM.assuranceDecennale} />
      </p>

      <h2>6. Médiation de la consommation</h2>
      <p>
        Conformément à l'article L.616-1 du code de la consommation, tout consommateur a
        le droit de recourir gratuitement à un médiateur de la consommation en vue de la
        résolution amiable d'un litige l'opposant à {DPM.nomCommercial}, après avoir tenté
        de le résoudre directement auprès de l'entreprise.
      </p>
      <p>
        Médiateur dont relève {DPM.nomCommercial} : <Champ valeur={DPM.mediateur} />
      </p>

      <h2>7. Propriété intellectuelle</h2>
      <p>
        L'ensemble des éléments composant ce site — structure, textes, photographies,
        graphismes, code — est protégé par le droit de la propriété intellectuelle. Toute
        reproduction ou représentation, totale ou partielle, sans autorisation écrite préalable,
        est interdite.
      </p>
      <p>
        Les photographies de réalisations présentées sur ce site ont été prises sur les chantiers
        de {DPM.nomCommercial}. Les marques et logos des partenaires affichés appartiennent à
        leurs titulaires respectifs et sont reproduits à des fins d'identification.
      </p>

      <h2>8. Responsabilité</h2>
      <p>
        {DPM.nomCommercial} s'efforce d'assurer l'exactitude des informations publiées sur ce
        site, sans pouvoir en garantir l'exhaustivité ni l'actualité permanente. Les prix,
        délais et disponibilités annoncés le sont à titre indicatif et ne constituent pas une
        offre contractuelle : seul un devis signé engage l'entreprise.
      </p>

      <h2>9. Données personnelles</h2>
      <p>
        Les traitements de données personnelles mis en œuvre par ce site, ainsi que l'absence de
        traceurs, sont décrits dans la{" "}
        <a href="/confidentialite">politique de confidentialité</a>.
      </p>

      <h2>10. Signalement</h2>
      <p>
        Toute demande relative à un contenu publié sur ce site peut être adressée à{" "}
        <a href={`mailto:${DPM.email}`}>{DPM.email}</a>. Elle sera examinée dans les meilleurs
        délais.
      </p>
    </PageLegale>
  );
}
