"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Doctor } from "@/types/doctors";
import StarRating from "@/components/StarRating/StarRating";
import styles from "./page.module.scss";

type Props = {
  params: Promise<{ id: string }>;
};

export default function DoctorPage({ params }: Props) {
  const { id } = use(params);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Doctor not found");
        return res.json();
      })
      .then(setDoctor)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className={styles.centered}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className={styles.centered}>
        <p className={styles.error}>Médecin introuvable.</p>
        <Link href="/" className={styles.back}>← Retour</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.back}>← Retour</Link>
      <div className={styles.card}>
        <h1 className={styles.name}>Dr. {doctor.first_name} {doctor.last_name}</h1>
        <span className={`${styles.status} ${styles[doctor.status]}`}>
          {doctor.status === "active" ? "Actif" : "En retraite"}
        </span>
        <dl className={styles.details}>
          <dt>Spécialité</dt><dd>{doctor.specialty}</dd>
          <dt>Ville</dt><dd>{doctor.city}</dd>
          <dt>Email</dt><dd>{doctor.email}</dd>
          <dt>Expérience</dt><dd>{doctor.years_experience} ans</dd>
          <dt>Note</dt><dd><StarRating rating={doctor.rating} size={18} /></dd>
        </dl>
      </div>
    </div>
  );
}
