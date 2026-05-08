import Link from "next/link";
import { Doctor } from "../../types/doctors";
import StarRating from "../StarRating/StarRating";
import styles from "./DoctorCard.module.scss";

type DoctorCard = {
  doctor: Doctor;
};

const DoctorCard = ({ doctor }: DoctorCard) => {
  return (
    <Link href={`/doctors/${doctor.id}`} className={styles.card}>
      <h2 className={styles.name}>
        Dr. {doctor.first_name} {doctor.last_name}
      </h2>
      <p>Email: {doctor.email}</p>
      <p>City: {doctor.city}</p>
      <p>Specialty: {doctor.specialty}</p>
      <p>Years of Experience: {doctor.years_experience}</p>
      <p>Status: {doctor.status}</p>
      <StarRating rating={doctor.rating} />
    </Link>
  );
};

export default DoctorCard;
