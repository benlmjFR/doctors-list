"use client";

import { useState, useEffect } from "react";
import DoctorCard from "@/components/DoctorCard/DoctorCard";
import { Doctor } from "../../types/doctors";
import styles from "./DoctorList.module.scss";

function DoctorList() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const limit = 10;

  const fetchDoctors = async (currentOffset: number) => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("offset", String(currentOffset));
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/doctors?${params.toString()}`,
    );
    const data = await res.json();
    setDoctors(data.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    setOffset(0);
    fetchDoctors(0);
  }, [search, status]);

  useEffect(() => {
    fetchDoctors(offset);
  }, [offset]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Annuaire des Médecins</h1>
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Rechercher par nom..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />

        <div className={styles.toggle}>
          {["", "active", "retired"].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`${styles.toggleBtn} ${status === s ? styles.active : ""}`}
            >
              {s === "" ? "Tous" : s === "active" ? "Actifs" : "En retraite"}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {loading ? (
          <div className={styles.spinnerWrapper}>
            <div className={styles.spinner} />
          </div>
        ) : (
          doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))
        )}
      </div>

      <div className={styles.pagination}>
        <button
          onClick={() => setOffset((prev) => Math.max(0, prev - limit))}
          disabled={offset === 0}
        >
          ← Précédent
        </button>
        <span>Page {offset / limit + 1}</span>
        <button
          onClick={() => setOffset((prev) => prev + limit)}
          disabled={doctors.length < limit}
        >
          Suivant →
        </button>
      </div>
    </div>
  );
}

export default DoctorList;
